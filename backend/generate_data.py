import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

num_patients = 200
start_date = datetime(2022, 1, 1)
end_date = datetime(2023, 12, 31)

surgery_types = ['Knee Replacement', 'Hip Replacement', 'ACL Reconstruction', 'Rotator Cuff Repair', 'Spinal Fusion']
rehab_protocols = {
    'Knee Replacement': ['Strength Training', 'Flexibility', 'Gait Training'],
    'Hip Replacement': ['Range of Motion', 'Strengthening', 'Balance Exercises'],
    'ACL Reconstruction': ['Quadriceps Strengthening', 'Hamstring Curls', 'Proprioception'],
    'Rotator Cuff Repair': ['Pendulum Exercises', 'Isometrics', 'Scapular Stabilization'],
    'Spinal Fusion': ['Core Stability', 'Walking Program', 'Postural Education']
}
outcome_scores = np.arange(0, 101, 5)

def random_date(start, end):
    return start + timedelta(
        seconds=random.randint(0, int((end - start).total_seconds())),
    )

def generate_patient_data(patient_id):
    surgery_type = random.choice(surgery_types)
    surgery_date = random_date(start_date, end_date)
    protocol = random.choice(rehab_protocols[surgery_type])
    
    progress = []
    for week in range(1, 13):
        entry = {
            'patient_id': patient_id,
            'surgery_type': surgery_type,
            'surgery_date': surgery_date.strftime('%Y-%m-%d'),
            'rehab_protocol': protocol,
            'week': week,
            'functional_score': random.choice(outcome_scores),
            'pain_level': random.randint(0, 10),
            'adherence': round(random.uniform(0.5, 1.0), 2)
        }
        progress.append(entry)
        
    return progress

def create_dataset(num_patients):
    all_patient_data = []
    for i in range(1, num_patients + 1):
        all_patient_data.extend(generate_patient_data(f'PAT_{i:04d}'))
        
    df = pd.DataFrame(all_patient_data)
    return df

if __name__ == "__main__":
    patient_dataset = create_dataset(num_patients)
    patient_dataset.to_csv('backend/patient_data.csv', index=False)
    print(f"Generated {len(patient_dataset)} records for {num_patients} patients.")
