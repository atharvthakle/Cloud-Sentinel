# data_collector.py - Collects metrics from cloud instances

import random
import time
import pandas as pd
from datetime import datetime, timedelta, timezone
import config

class DataCollector:
    def __init__(self):
        self.simulation_mode = config.SIMULATION_MODE
        self.num_instances = config.NUM_SIMULATED_INSTANCES
        self.use_aws = config.USE_AWS
        
        # Initialize AWS clients if needed
        if self.use_aws and not self.simulation_mode:
            try:
                import boto3
                self.ec2_client = boto3.client(
                    'ec2',
                    aws_access_key_id=config.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=config.AWS_SECRET_ACCESS_KEY,
                    region_name=config.AWS_REGION
                )
                self.cloudwatch_client = boto3.client(
                    'cloudwatch',
                    aws_access_key_id=config.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=config.AWS_SECRET_ACCESS_KEY,
                    region_name=config.AWS_REGION
                )
                print("✅ AWS clients initialized successfully")
            except Exception as e:
                print(f"❌ Error initializing AWS clients: {e}")
                self.simulation_mode = True  # Fallback to simulation
        
    def simulate_metric_data(self):
        """
        Generates fake cloud metrics for testing
        Returns a list of metric dictionaries
        """
        metrics = []
        
        for instance_id in range(1, self.num_instances + 1):
            # Normal behavior: CPU 20-60%, Memory 30-70%, Network 100-500 MB
            cpu = random.uniform(20, 60)
            memory = random.uniform(30, 70)
            network = random.uniform(100, 500)
            
            # Randomly inject anomalies (10% chance)
            if random.random() < 0.1:
                anomaly_type = random.choice(['cpu', 'memory', 'network'])
                if anomaly_type == 'cpu':
                    cpu = random.uniform(85, 99)  # CPU spike!
                elif anomaly_type == 'memory':
                    memory = random.uniform(85, 99)  # Memory spike!
                else:
                    network = random.uniform(800, 1500)  # Network spike!
            
            metric = {
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'instance_id': f'instance-{instance_id}',
                'cpu_usage': round(cpu, 2),
                'memory_usage': round(memory, 2),
                'network_traffic': round(network, 2)
            }
            metrics.append(metric)
        
        return metrics
    
    def get_aws_instances(self):
        """
        Get list of running EC2 instances
        """
        try:
            response = self.ec2_client.describe_instances(
                Filters=[
                    {'Name': 'instance-state-name', 'Values': ['running']}
                ]
            )
            
            instances = []
            for reservation in response['Reservations']:
                for instance in reservation['Instances']:
                    instances.append({
                        'id': instance['InstanceId'],
                        'type': instance['InstanceType'],
                        'name': self._get_instance_name(instance)
                    })
            
            return instances
        except Exception as e:
            print(f"❌ Error fetching EC2 instances: {e}")
            return []
    
    def _get_instance_name(self, instance):
        """
        Extract instance name from tags
        """
        if 'Tags' in instance:
            for tag in instance['Tags']:
                if tag['Key'] == 'Name':
                    return tag['Value']
        return instance['InstanceId']
    
    def get_cloudwatch_metric(self, instance_id, metric_name, namespace='AWS/EC2'):
        """
        Fetch a specific metric from CloudWatch
        """
        try:
            end_time = datetime.now(timezone.utc)
            start_time = end_time - timedelta(minutes=5)
            
            response = self.cloudwatch_client.get_metric_statistics(
                Namespace=namespace,
                MetricName=metric_name,
                Dimensions=[
                    {
                        'Name': 'InstanceId',
                        'Value': instance_id
                    }
                ],
                StartTime=start_time,
                EndTime=end_time,
                Period=300,  # 5 minutes
                Statistics=['Average']
            )
            
            if response['Datapoints']:
                # Get the most recent datapoint
                datapoint = sorted(response['Datapoints'], key=lambda x: x['Timestamp'])[-1]
                return datapoint['Average']
            else:
                return 0.0
                
        except Exception as e:
            print(f"❌ Error fetching {metric_name} for {instance_id}: {e}")
            return 0.0
    
    def collect_real_aws_data(self):
        """
        Collects real data from AWS EC2 instances via CloudWatch
        """
        metrics = []
        
        # Get all running instances
        instances = self.get_aws_instances()
        
        if not instances:
            print("⚠️  No running EC2 instances found. Using simulation mode.")
            return self.simulate_metric_data()
        
        print(f"📊 Found {len(instances)} running EC2 instances")
        
        for instance in instances:
            instance_id = instance['id']
            print(f"🔍 Collecting metrics for {instance['name']} ({instance_id})...")
            
            # Fetch metrics from CloudWatch
            cpu = self.get_cloudwatch_metric(instance_id, 'CPUUtilization')
            
            # Note: Memory and Network require CloudWatch agent to be installed on instances
            # For now, we'll use CPU and simulate others (you can enhance this later)
            memory = random.uniform(30, 70)  # Simulated for now
            network = random.uniform(100, 500)  # Simulated for now
            
            metric = {
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'instance_id': instance['name'],
                'cpu_usage': round(cpu, 2),
                'memory_usage': round(memory, 2),
                'network_traffic': round(network, 2)
            }
            metrics.append(metric)
            
            print(f"  ✅ CPU: {cpu:.2f}% | Memory: {memory:.2f}% | Network: {network:.2f} MB")
        
        return metrics
    
    def collect_data(self):
        """
        Main method to collect data (simulated or real)
        """
        if self.simulation_mode:
            print("🎮 Simulation mode - generating fake data")
            return self.simulate_metric_data()
        elif self.use_aws:
            print("☁️  AWS mode - fetching real CloudWatch metrics")
            return self.collect_real_aws_data()
        else:
            print("⚠️  No valid data source configured")
            return self.simulate_metric_data()
    
    def save_to_csv(self, metrics, filename=config.DATA_FILE):
        """
        Saves collected metrics to CSV file
        """
        df = pd.DataFrame(metrics)
        
        # If file exists, append. Otherwise create new file
        try:
            existing_df = pd.read_csv(filename)
            df = pd.concat([existing_df, df], ignore_index=True)
        except FileNotFoundError:
            pass  # File doesn't exist yet, will create new
        
        df.to_csv(filename, index=False)
        print(f"✅ Saved {len(metrics)} metrics to {filename}")
        return df

# Test the collector
if __name__ == "__main__":
    print("🔍 Testing Data Collector...")
    print(f"Simulation Mode: {config.SIMULATION_MODE}")
    print(f"Use AWS: {config.USE_AWS}")
    print()
    
    collector = DataCollector()
    
    # Collect data once
    print("📊 Collecting metrics...")
    metrics = collector.collect_data()
    
    # Display collected metrics
    print("\n📈 Collected Metrics:")
    for metric in metrics:
        print(f"  {metric['instance_id']}: CPU={metric['cpu_usage']}% | "
              f"Memory={metric['memory_usage']}% | "
              f"Network={metric['network_traffic']} MB")
    
    # Save to CSV
    print()
    collector.save_to_csv(metrics)
    
    print("\n✅ Data collection test complete!")