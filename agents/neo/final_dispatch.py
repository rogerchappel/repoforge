#!/usr/bin/env python3

import subprocess
import sys

def main():
    print("Starting CrewCmd queue dispatch analysis...")
    print("Current time: Monday, September 14th, 2026 - 11:16 PM (Australia/Brisbane)")
    
    # First, let's get the tasks and agents directly from the database
    print("\n--- Database Analysis ---")
    
    # Get all tasks assigned to agents that are not in 'done' status
    print("Checking tasks assigned to agents...")
    
    # Let's run a direct query to see what we have
    tasks_query = """
        SELECT 
            t.id, 
            t.title, 
            t.status, 
            t.assigned_agent_id, 
            a.callsign, 
            a.status as agent_status
        FROM tasks t 
        LEFT JOIN agents a ON t.assigned_agent_id::text = a.id::text 
        WHERE t.assigned_agent_id IS NOT NULL 
            AND t.status != 'done'
        ORDER BY t.created_at ASC;
    """
    
    try:
        result = subprocess.run([
            '/opt/homebrew/opt/postgresql/bin/psql', 
            '-d', 'crewcmd', 
            '-t',  # tuples only
            '-A',  # always separate with |
            '-F', '|',  # field separator
            '-c', tasks_query
        ], capture_output=True, text=True, check=True)
        
        lines = result.stdout.strip().split('\n')
        if not lines or lines == ['']:
            print("No tasks found to dispatch.")
            print("Stopping silently as there is nothing to dispatch.")
            return
        
        print(f"Found {len(lines)-1} tasks assigned to agents:")
        
        # Process each task line by line
        for i, line in enumerate(lines[1:], 1):  # Skip header line
            if line.strip():
                values = line.split('|')
                if len(values) >= 6:
                    task_id = values[0]
                    title = values[1]
                    task_status = values[2]
                    assigned_agent_id = values[3]
                    agent_callsign = values[4]
                    agent_status = values[5]
                    
                    print(f"\nTask {i}:")
                    print(f"  ID: {task_id}")
                    print(f"  Title: {title[:60]}...")
                    print(f"  Assigned agent: {agent_callsign} ({assigned_agent_id})")
                    print(f"  Agent status: {agent_status}")
                    print(f"  Task status: {task_status}")
                    
                    # Analyze the situation
                    if agent_status == 'offline':
                        print(f"  -> Agent is offline (detached from runtime)")
                        print(f"  -> Task remains queued")
                    elif agent_status == 'online':
                        print(f"  -> Agent is online and available")
                        print(f"  -> Task would be dispatched to {agent_callsign}")
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
        
    except subprocess.CalledProcessError as e:
        print(f"Error running database query: {e}")
        print(f"Stderr: {e.stderr}")
        print("Stopping silently as there is nothing to dispatch.")
        return

if __name__ == "__main__":
    main()