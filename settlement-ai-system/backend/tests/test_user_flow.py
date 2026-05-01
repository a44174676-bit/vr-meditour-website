import os
from pathlib import Path
from fastapi.testclient import TestClient

# Ensure isolated SQLite DB per test run
DB_PATH = Path(__file__).parent / 'test_settlement.db'
os.environ['DATABASE_URL'] = f"sqlite:///{DB_PATH}"

from database import Base, engine
from main import app


client = TestClient(app)


def setup_module():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def teardown_module():
    if DB_PATH.exists():
        DB_PATH.unlink()


def test_user_flow_endpoints():
    payload = {
        'name': 'Test User', 'nationality': 'Vietnam', 'language': 'Vietnamese', 'visa_type': 'D-2',
        'entry_date': '2026-06-01', 'region': 'Seoul', 'korean_level': '초급', 'stay_purpose': '유학',
        'medical_tourism': False, 'international_marriage': False, 'housing_status': '미정',
        'community_status': '없음', 'privacy_consent': True, 'counseling_note': '불안'
    }
    r = client.post('/users', json=payload)
    assert r.status_code == 200
    user_id = r.json()['id']

    r = client.post(f'/users/{user_id}/generate-roadmap')
    assert r.status_code == 200
    tasks = r.json()['generated_tasks']
    assert len(tasks) > 0
    task_id = tasks[0]['id']

    r = client.get(f'/users/{user_id}/tasks')
    assert r.status_code == 200

    r = client.patch(f'/tasks/{task_id}/status', json={'status': '최종 완료'})
    assert r.status_code == 200

    r = client.get(f'/users/{user_id}/passport')
    assert r.status_code == 200
    assert 'progress' in r.json()

    r = client.post(f'/users/{user_id}/risk')
    assert r.status_code == 200
    assert 'risk_level' in r.json()

    r = client.get('/handoffs')
    assert r.status_code == 200

    r = client.get('/dashboard/operator')
    assert r.status_code == 200
