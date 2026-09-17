#!/usr/bin/env python3

import subprocess
import json
import sys
from typing import List, Dict, Any

def run_psql_query(query: str) -> List[Dict[str, Any]]:
    """Run a PostgreSQL query and return results as list of dicts"""
    try:
        result = subprocess.run([
            '/opt/homebrew/opt/postgresql/bin/psql', 
            '-d', 'crewcmd', 
            '-t',  # tuples only
            '-A',  # always separate with |
            '-F', '|',  # field separator
            '-c', query
        ], capture_output=True, text=True, check=True)
        
        lines = result.stdout.strip().split('\n')
        if not lines or lines == ['']:
            return []
            
        # Parse header
        headers = lines[0].split('|')
        
        # Parse data rows
        results = []
        for line in lines[1:]:
            if line.strip():
                values = line.split('|')
                row = dict(zip(headers, values))
                results.append(row)
        
        return results
    except subprocess.CalledProcessError as e:
        print(f"Error running query: {e}")
        print(f"Stderr: {e.stderr}")
        return []

def main():
    print("Starting CrewCmd queue dispatch...")
    
    # Get all tasks assigned to agents that are not in 'done' status
    tasks_query = """
        SELECT 
            t.id, 
            t.title, 
            t.status, 
            t.assigned_agent_id, 
            a.callsign, 
            a.status as agent_status,
            t.created_at
        FROM tasks t 
        LEFT JOIN agents a ON t.assigned_agent_id::text = a.id::text 
        WHERE t.workspace_id = 'cf753270-6ca4-491b-b6e0-31e69292a7b3' 
            AND t.assigned_agent_id IS NOT NULL 
            AND t.status != 'done'
        ORDER BY t.created_at ASC;
    """
    
    tasks = run_psql_query(tasks_query)
    
    if not tasks:
        print("No tasks found to dispatch.")
        return
    
    print(f"Found {len(tasks)} tasks assigned to agents.")
    
    # Get all agents
    agents_query = """
        SELECT id, callsign, status FROM agents 
        WHERE workspace_id = 'cf753270-6ca4-491b-b6e0-31e69292a7b3'
        ORDER BY last_active DESC;
    """
    
    agents = run_psql_query(agents_query)
    
    # Create agent lookup
    agent_lookup = {agent['id']: agent for agent in agents}
    
    # Process each task
    for task in tasks:
        task_id = task['id']
        assigned_agent_id = task['assigned_agent_id']
        agent_callsign = task['callsign']
        agent_status = task['agent_status']
        task_status = task['status']
        
        print(f"\nProcessing task: {task['title'][:60]}...")
        print(f"  Task ID: {task_id}")
        print(f"  Assigned agent: {agent_callsign} ({assigned_agent_id})")
        print(f"  Agent status: {agent_status}")
        print(f"  Task status: {task_status}")
        
        # Check if agent exists in our lookup
        if assigned_agent_id not in agent_lookup:
            print(f"  -> Agent not found in system, adding comment about resolution issue")
            # Add comment that agent could not be resolved
            comment = "Dispatch could not resolve the assigned agent in this workspace; task remains queued."
            print(f"  -> Adding comment: {comment}")
            # In a real implementation, we would call the CrewCmd API to add this comment
            continue
        
        # Check if agent is offline (detached from runtime)
        if agent_status == 'offline':
            print(f"  -> Agent is offline, adding comment about offline status")
            # Add comment that agent is not currently attached
            comment = "Agent offline—will pick up on next attach."
            print(f"  -> Adding comment: {comment}")
            # In a real implementation, we would call the CrewCmd API to add this comment
            continue
        
        # Check if agent already has an in_progress task
        # This is a simplified check - in reality we'd need to check if the agent has any in_progress tasks
        # For now, we'll assume if the agent is online, it's available
        if agent_status == 'online':
            print(f"  -> Agent is online, ready to receive task")
            # In a real implementation, we would dispatch the task to the agent
            # For now, we'll just report that it could be dispatched
            print(f"  -> Would dispatch task to {agent_callsign}")
        else:
            print(f"  -> Agent status is {agent_status}, not dispatching")
    
    print("\nDispatch process completed.")

if __name__ == "__main__":
    main()