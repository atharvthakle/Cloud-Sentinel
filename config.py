# config.py - Configuration settings for CloudSentinel

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# GCP Settings (keep for reference)
GCP_PROJECT_ID = "your-project-id"
GCP_CREDENTIALS_PATH = "credentials.json"

# AWS Settings (NEW)
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')

# Data Collection Settings
COLLECTION_INTERVAL = 60
METRICS_TO_COLLECT = ['cpu_usage', 'memory_usage', 'network_traffic']

# Anomaly Detection Settings
ANOMALY_THRESHOLD = 0.1
CONTAMINATION = 0.05

# File Paths
DATA_FILE = 'data/metrics.csv'
MODEL_FILE = 'models/anomaly_model.pkl'
LOG_FILE = 'logs/app.log'

# Simulation Settings
SIMULATION_MODE = True  # Set to False when using real AWS
USE_AWS = True  # Set to True to use AWS instead of GCP
NUM_SIMULATED_INSTANCES = 3

# GCP Settings (we'll use these later)
GCP_PROJECT_ID = "your-project-id"  # We'll fill this later
GCP_CREDENTIALS_PATH = "credentials.json"  # We'll create this later

# Data Collection Settings
COLLECTION_INTERVAL = 60  # Collect data every 60 seconds
METRICS_TO_COLLECT = ['cpu_usage', 'memory_usage', 'network_traffic']

# Anomaly Detection Settings
ANOMALY_THRESHOLD = 0.1  # How sensitive the detector is (lower = more sensitive)
CONTAMINATION = 0.05  # Expected percentage of anomalies (5%)

# File Paths
DATA_FILE = 'data/metrics.csv'
MODEL_FILE = 'models/anomaly_model.pkl'
LOG_FILE = 'logs/app.log'

# Simulation Settings (for testing without GCP)
SIMULATION_MODE = False  # Set to False when using real GCP
NUM_SIMULATED_INSTANCES = 3  # Number of fake cloud instances to simulate