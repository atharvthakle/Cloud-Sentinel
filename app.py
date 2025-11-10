# app.py - Main Flask Backend API

from flask import Flask, jsonify, request
from flask_cors import CORS
from data_collector import DataCollector
from anomaly_detector import AnomalyDetector
import pandas as pd
import config
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize our components
collector = DataCollector()
detector = AnomalyDetector()

# Try to load existing model if available
if os.path.exists(config.MODEL_FILE):
    detector.load_model()
    print("✅ Loaded existing model")

# ==================== API ROUTES ====================

@app.route('/')
def home():
    """
    Home page - API info
    """
    return jsonify({
        'app': 'CloudSentinel',
        'version': '1.0',
        'description': 'Anomaly Detection in Cloud Resource Usage',
        'endpoints': {
            '/': 'API information',
            '/health': 'Check if API is running',
            '/collect': 'Collect new metrics data',
            '/train': 'Train anomaly detection model',
            '/detect': 'Detect anomalies in collected data',
            '/status': 'Get current system status',
            '/anomalies': 'Get list of all detected anomalies',
            '/metrics': 'Get all collected metrics',
            '/clear': 'Clear all data (use with caution)'
        }
    })

@app.route('/health')
def health():
    """
    Health check endpoint
    """
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'model_trained': detector.is_trained
    })

@app.route('/collect', methods=['POST'])
def collect_data():
    """
    Collect new metrics data
    """
    try:
        # Get number of collections (default = 1)
        num_collections = request.json.get('num_collections', 1) if request.json else 1
        
        all_metrics = []
        for i in range(num_collections):
            metrics = collector.collect_data()
            all_metrics.extend(metrics)
        
        # Save to CSV
        collector.save_to_csv(all_metrics)
        
        return jsonify({
            'status': 'success',
            'message': f'Collected {len(all_metrics)} metrics',
            'data': all_metrics
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/train', methods=['POST'])
def train_model():
    """
    Train the anomaly detection model
    """
    try:
        # Load data
        df = detector.load_data()
        
        if df is None or len(df) == 0:
            return jsonify({
                'status': 'error',
                'message': 'No data available to train. Collect data first using /collect'
            }), 400
        
        # Train model
        detector.train_model(df)
        
        # Save model
        detector.save_model()
        
        return jsonify({
            'status': 'success',
            'message': f'Model trained successfully on {len(df)} records',
            'records_used': len(df)
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/detect', methods=['POST'])
def detect_anomalies():
    """
    Detect anomalies in the collected data
    """
    try:
        if not detector.is_trained:
            return jsonify({
                'status': 'error',
                'message': 'Model not trained yet. Train the model first using /train'
            }), 400
        
        # Load data
        df = detector.load_data()
        
        if df is None or len(df) == 0:
            return jsonify({
                'status': 'error',
                'message': 'No data available to analyze'
            }), 400
        
        # Detect anomalies
        df_with_anomalies = detector.detect_anomalies(df)
        df_with_scores = detector.get_anomaly_score(df_with_anomalies)
        
        # Save results
        output_file = 'data/metrics_with_anomalies.csv'
        df_with_scores.to_csv(output_file, index=False)
        
        # Get anomalies
        anomalies = df_with_scores[df_with_scores['anomaly'] == -1]
        
        return jsonify({
            'status': 'success',
            'message': f'Analysis complete',
            'total_records': len(df_with_scores),
            'anomalies_found': len(anomalies),
            'anomalies': anomalies.to_dict('records')
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/status')
def get_status():
    """
    Get current system status
    """
    try:
        # Check if data file exists
        data_exists = os.path.exists(config.DATA_FILE)
        num_records = 0
        
        if data_exists:
            df = pd.read_csv(config.DATA_FILE)
            num_records = len(df)
        
        # Check if model exists
        model_exists = os.path.exists(config.MODEL_FILE)
        
        return jsonify({
            'status': 'success',
            'data': {
                'data_collected': data_exists,
                'total_records': num_records,
                'model_trained': detector.is_trained,
                'model_file_exists': model_exists,
                'simulation_mode': config.SIMULATION_MODE,
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/anomalies')
def get_anomalies():
    """
    Get all detected anomalies
    """
    try:
        output_file = 'data/metrics_with_anomalies.csv'
        
        if not os.path.exists(output_file):
            return jsonify({
                'status': 'error',
                'message': 'No anomaly detection results found. Run /detect first'
            }), 404
        
        df = pd.read_csv(output_file)
        anomalies = df[df['anomaly'] == -1]
        
        return jsonify({
            'status': 'success',
            'total_anomalies': len(anomalies),
            'anomalies': anomalies.to_dict('records')
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/metrics')
def get_metrics():
    """
    Get all collected metrics
    """
    try:
        if not os.path.exists(config.DATA_FILE):
            return jsonify({
                'status': 'error',
                'message': 'No data collected yet. Use /collect first'
            }), 404
        
        df = pd.read_csv(config.DATA_FILE)
        
        return jsonify({
            'status': 'success',
            'total_records': len(df),
            'metrics': df.to_dict('records')
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/clear', methods=['POST'])
def clear_data():
    """
    Clear all data and model (use with caution!)
    """
    try:
        # Remove data files
        if os.path.exists(config.DATA_FILE):
            os.remove(config.DATA_FILE)
        
        if os.path.exists('data/metrics_with_anomalies.csv'):
            os.remove('data/metrics_with_anomalies.csv')
        
        # Remove model
        if os.path.exists(config.MODEL_FILE):
            os.remove(config.MODEL_FILE)
        
        # Reset detector
        detector.model = None
        detector.is_trained = False
        
        return jsonify({
            'status': 'success',
            'message': 'All data and model cleared successfully'
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# ==================== RUN THE APP ====================

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 CloudSentinel Backend API Starting...")
    print("="*50)
    print(f"📡 Server will run at: http://127.0.0.1:5000")
    print(f"📊 Simulation Mode: {config.SIMULATION_MODE}")
    print(f"🤖 Model Loaded: {detector.is_trained}")
    print("="*50 + "\n")
    
    app.run(debug=True, port=5000)