# anomaly_detector.py - ML model for detecting anomalies

import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import pickle
import os
import config

class AnomalyDetector:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.is_trained = False
        
    def load_data(self, filename=config.DATA_FILE):
        """
        Load metrics data from CSV
        """
        try:
            df = pd.read_csv(filename)
            print(f"✅ Loaded {len(df)} records from {filename}")
            return df
        except FileNotFoundError:
            print(f"❌ Error: {filename} not found!")
            return None
    
    def prepare_features(self, df):
        """
        Prepare data for ML model
        Extracts only the numeric features we want to analyze
        """
        # Select only the metric columns (not timestamp or instance_id)
        features = df[['cpu_usage', 'memory_usage', 'network_traffic']].copy()
        return features
    
    def train_model(self, df):
        """
        Train the Isolation Forest model on the data
        """
        print("\n🧠 Training anomaly detection model...")
        
        # Prepare features
        features = self.prepare_features(df)
        
        # Normalize the data (makes ML work better)
        features_scaled = self.scaler.fit_transform(features)
        
        # Create and train Isolation Forest model
        self.model = IsolationForest(
            contamination=config.CONTAMINATION,  # Expected % of anomalies
            random_state=42,  # For reproducible results
            n_estimators=100  # Number of trees in the forest
        )
        
        self.model.fit(features_scaled)
        self.is_trained = True
        
        print("✅ Model training complete!")
        
    def detect_anomalies(self, df):
        """
        Use trained model to detect anomalies in the data
        Returns the dataframe with an 'anomaly' column added
        """
        if not self.is_trained:
            print("❌ Error: Model not trained yet!")
            return None
        
        print("\n🔍 Detecting anomalies...")
        
        # Prepare features
        features = self.prepare_features(df)
        
        # Normalize using the same scaler from training
        features_scaled = self.scaler.transform(features)
        
        # Predict: -1 = anomaly, 1 = normal
        predictions = self.model.predict(features_scaled)
        
        # Add predictions to dataframe
        df['anomaly'] = predictions
        df['is_anomaly'] = df['anomaly'].apply(lambda x: 'YES' if x == -1 else 'NO')
        
        # Count anomalies
        num_anomalies = len(df[df['anomaly'] == -1])
        print(f"✅ Detection complete! Found {num_anomalies} anomalies out of {len(df)} records")
        
        return df
    
    def get_anomaly_score(self, df):
        """
        Get anomaly scores (lower score = more anomalous)
        """
        features = self.prepare_features(df)
        features_scaled = self.scaler.transform(features)
        
        # Get anomaly scores
        scores = self.model.decision_function(features_scaled)
        df['anomaly_score'] = scores
        
        return df
    
    def save_model(self, filename=config.MODEL_FILE):
        """
        Save trained model to disk
        """
        if not self.is_trained:
            print("❌ Cannot save: Model not trained yet!")
            return
        
        # Save both model and scaler
        model_data = {
            'model': self.model,
            'scaler': self.scaler
        }
        
        with open(filename, 'wb') as f:
            pickle.dump(model_data, f)
        
        print(f"✅ Model saved to {filename}")
    
    def load_model(self, filename=config.MODEL_FILE):
        """
        Load trained model from disk
        """
        try:
            with open(filename, 'rb') as f:
                model_data = pickle.load(f)
            
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.is_trained = True
            
            print(f"✅ Model loaded from {filename}")
        except FileNotFoundError:
            print(f"❌ Error: {filename} not found!")
    
    def display_anomalies(self, df):
        """
        Display all detected anomalies in a readable format
        """
        anomalies = df[df['anomaly'] == -1]
        
        if len(anomalies) == 0:
            print("\n✅ No anomalies detected - all systems normal!")
            return
        
        print(f"\n⚠️  ANOMALIES DETECTED ({len(anomalies)} found):")
        print("=" * 80)
        
        for idx, row in anomalies.iterrows():
            print(f"\n🚨 Instance: {row['instance_id']} | Time: {row['timestamp']}")
            print(f"   CPU: {row['cpu_usage']}% | Memory: {row['memory_usage']}% | Network: {row['network_traffic']} MB")
            
            # Identify which metric is unusual
            if row['cpu_usage'] > 80:
                print(f"   ⚠️  HIGH CPU USAGE!")
            if row['memory_usage'] > 80:
                print(f"   ⚠️  HIGH MEMORY USAGE!")
            if row['network_traffic'] > 700:
                print(f"   ⚠️  HIGH NETWORK TRAFFIC!")

# Test the detector
if __name__ == "__main__":
    print("🤖 Testing Anomaly Detector...")
    
    detector = AnomalyDetector()
    
    # Load the data we collected earlier
    df = detector.load_data()
    
    if df is not None:
        # Train the model
        detector.train_model(df)
        
        # Detect anomalies
        df_with_anomalies = detector.detect_anomalies(df)
        
        # Get anomaly scores
        df_with_scores = detector.get_anomaly_score(df_with_anomalies)
        
        # Display anomalies
        detector.display_anomalies(df_with_scores)
        
        # Save the trained model
        detector.save_model()
        
        # Save results to new CSV
        output_file = 'data/metrics_with_anomalies.csv'
        df_with_scores.to_csv(output_file, index=False)
        print(f"\n✅ Results saved to {output_file}")
        
        # Show summary statistics
        print("\n📊 Summary:")
        print(f"   Total records: {len(df)}")
        print(f"   Anomalies found: {len(df[df['anomaly'] == -1])}")
        print(f"   Normal records: {len(df[df['anomaly'] == 1])}")