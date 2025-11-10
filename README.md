# Cloud Sentinel

**Intelligent Security Monitoring System with Machine Learning-Based Anomaly Detection**

CloudSentinel is a real-time cloud infrastructure monitoring system that leverages Machine Learning to detect anomalies in AWS EC2 instances. Built with Python, Flask, React, and AWS CloudWatch integration.

## Preview

![Image](https://github.com/user-attachments/assets/892c1ecb-6d62-412e-a19d-a453eb790767)

![Image](https://github.com/user-attachments/assets/96066572-4a04-4a1f-b906-a49683e5ca35)

![Image](https://github.com/user-attachments/assets/d50891ec-b2b4-4217-a387-160f401d9310)

![Image](https://github.com/user-attachments/assets/5bb890ec-bd45-4805-ad39-45497dae5906)

![Image](https://github.com/user-attachments/assets/4e8b67a7-184b-40d4-8019-73f32af1d558)

![Image](https://github.com/user-attachments/assets/244d0e9f-749f-4f12-bbe4-b438ccdfbc93)

![Image](https://github.com/user-attachments/assets/72aa6b85-7438-4db3-8efb-f89a849d6420)

![Image](https://github.com/user-attachments/assets/8ae358b9-ae40-44cc-86b2-5401f260f041)

![Image](https://github.com/user-attachments/assets/5e86a2b7-1fdf-45f1-a842-8f6d31b8c9d2)

## Features

- **Real-time AWS Integration** - Fetches live metrics from EC2 instances via CloudWatch API
- **ML-Powered Anomaly Detection** - Uses Isolation Forest algorithm for intelligent pattern recognition
- **Beautiful Dashboard** - Modern, dark-themed Next.js frontend with interactive charts
- **Security-First** - IAM-based authentication, read-only permissions
- **Real-time Monitoring** - Auto-refresh every 30 seconds
- **Data Visualization** - Interactive charts using Recharts library
- **Instant Alerts** - Immediate notification of suspicious activity

## Architecture

    ┌─────────────────┐
    │   AWS EC2       │
    │   Instances     │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  CloudWatch API │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐      ┌──────────────────┐
    │  Flask Backend  │◄────►│  Next.js Frontend│
    │  (Python/ML)    │      │  (React)         │
    └─────────────────┘      └──────────────────┘
             │
             ▼
    ┌─────────────────┐
    │  Isolation      │
    │  Forest Model   │
    └─────────────────┘

## Tech Stack

### Backend
- **Python 3.11+**
- **Flask** - REST API framework
- **boto3** - AWS SDK for Python
- **scikit-learn** - Machine Learning (Isolation Forest)
- **pandas** - Data manipulation
- **numpy** - Numerical computing

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **shadcn/ui** - UI components

### Cloud & DevOps
- **AWS EC2** - Compute instances
- **AWS CloudWatch** - Metrics & monitoring
- **AWS IAM** - Access management

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/CloudSentinel.git
cd CloudSentinel
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure AWS Credentials

Create a `.env` file in the root directory:
```env
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
```

**Never commit this file to Git!** It's already in `.gitignore`.

### 4. Run Backend
```bash
python app.py
```

Backend will start on `http://127.0.0.1:5000`

### 5. Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend will start on `http://localhost:3000`

### 6. Access Dashboard

Open your browser and navigate to `http://localhost:3000`

## Usage

### Collect Data
1. Click **"Collect Data"** to fetch metrics from AWS EC2 instances
2. Data is collected via CloudWatch API (CPU, Memory, Network)

### Train Model
1. Click **"Train Model"** to train the Isolation Forest on collected data
2. Model learns normal behavior patterns

### Detect Anomalies
1. Click **"Detect Anomalies"** to analyze metrics
2. View detected anomalies in the dashboard
3. Red alerts show suspicious activity (high CPU, memory spikes, unusual network traffic)

## 🔧 Configuration

### Backend (`config.py`)
```python
# Simulation mode (True = fake data, False = real AWS)
SIMULATION_MODE = False

# Use AWS
USE_AWS = True

# ML parameters
CONTAMINATION = 0.05  # Expected % of anomalies (5%)
```

### AWS Setup

1. **Create IAM User:**
   - Permissions: `CloudWatchReadOnlyAccess`, `AmazonEC2ReadOnlyAccess`
   - Generate Access Keys

2. **Launch EC2 Instances:**
   - Type: `t2.micro` (Free Tier eligible)
   - OS: Amazon Linux 2023
   - Ensure instances are running

---

## Project Structure
```
CloudSentinel/
├── backend/
│   ├── app.py                  # Flask REST API
│   ├── config.py               # Configuration
│   ├── data_collector.py       # AWS CloudWatch integration
│   ├── anomaly_detector.py     # ML model
│   ├── requirements.txt        # Python dependencies
│   ├── data/                   # Collected metrics (CSV)
│   ├── models/                 # Trained ML models
│   └── logs/                   # Application logs
│
├── frontend/
│   ├── app/                    # Next.js pages
│   ├── components/             # React components
│   ├── public/                 # Static assets
│   ├── package.json            # Node dependencies
│   └── next.config.mjs         # Next.js config
│
├── .env                        # Environment variables (NOT in Git)
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## Machine Learning

### Algorithm: Isolation Forest

**Why Isolation Forest?**
- Unsupervised learning (no labeled data needed)
- Fast: O(n log n) complexity
- Efficient with high-dimensional data
- Specifically designed for anomaly detection

**How it works:**
- Builds 100 random isolation trees
- Anomalies are easier to isolate (fewer splits)
- Measures path length - shorter = more anomalous
- Assigns anomaly scores (negative = anomaly)

**Parameters:**
- `contamination=0.05` - Expect 5% anomalies
- `n_estimators=100` - Number of trees
- `random_state=42` - Reproducibility

## Security

- IAM user with read-only permissions (least privilege)
- Credentials stored in environment variables
- `.gitignore` prevents credential commits
- No hardcoded secrets in code
- For production: Use IAM Roles instead of access keys

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
