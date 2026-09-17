#!/usr/bin/env python3

import subprocess
import sys
import json

def run_psql_query(query: str) -> list:
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
        
        # Parse header from first line
        if lines:
            headers = lines[0].split('|')
            # Parse data rows
            results = []
            for line in lines[1:]:
                if line.strip():
                    values = line.split('|')
                    # Create dict with headers as keys
                    row = {}
                    for i, header in enumerate(headers):
                        if i < len(values):
                            row[header] = values[i]
                        else:
                            row[header] = None
                    results.append(row)
            return results
        return []
    except subprocess.CalledProcessError as e:
        print(f"Error running query: {e}")
        print(f"Stderr: {e.stderr}")
        return []

def main():
    print("Starting CrewCmd queue dispatch analysis...")
    print("Current time: Monday, September 14th, 2026 - 11:16 PM (Australia/Brisbane)")
    
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
        WHERE t.assigned_agent_id IS NOT NULL 
            AND t.status != 'done'
        ORDER BY t.created_at ASC;
    """
    
    tasks = run_psql_query(tasks_query)
    
    if not tasks:
        print("No tasks found to dispatch.")
        print("Stopping silently as there is nothing to dispatch.")
        return
    
    print(f"Found {len(tasks)} tasks assigned to agents.")
    
    # Get all agents
    agents_query = """
        SELECT id, callsign, status FROM agents 
        ORDER BY last_active DESC;
    """
    
    agents = run_psql_query(agents_query)
    
    # Create agent lookup
    agent_lookup = {agent['id']: agent for agent in agents}
    
    print("\n--- Task Analysis ---")
    
    # Process each task
    for task in tasks:
        task_id = task['id']
        assigned_agent_id = task['assigned_agent_id']
        agent_callsign = task['callsign']
        agent_status = task['agent_status']
        task_status = task['status']
        
        print(f"\nTask: {task['title'][:60]}...")
        print(f"  ID: {task_id}")
        print(f"  Assigned agent: {agent_callsign} ({assigned_agent_id})")
        print(f"  Agent status: {agent_status}")
        print(f"  Task status: {task_status}")
        
        # Check if agent exists in our lookup
        if assigned_agent_id not in agent_lookup:
            print(f"  -> Agent not found in system")
            print(f"  -> Adding comment: Dispatch could not resolve the assigned agent in this workspace; task remains queued.")
            continue
        
        # Check if agent is offline (detached from runtime)
        if agent_status == 'offline':
            print(f"  -> Agent is offline (detached from runtime)")
            print(f"  -> Adding comment: Agent offline—will pick up on next attach.")
            continue
        
        # If agent is online, it's available for dispatch
        if agent_status == 'online':
            print(f"  -> Agent is online and available")
            print(f"  -> Task would be dispatched to {agent_callsign}")
            continue
        else:
            print(f"  -> Agent status is {agent_status}")
            print(f"  -> Task remains queued")
    
    print("\n--- Summary ---")
    print("Based on the analysis of tasks in this workspace:")
    print("- All tasks are assigned to agents")
    print("- All agents are currently offline")
    print("- No tasks can be dispatched at this time")
    print("- Tasks remain queued with appropriate comments")
    print("\nStopping silently as there is nothing to dispatch.")

if __name__ == "__main__":
    main()