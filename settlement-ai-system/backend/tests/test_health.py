from fastapi.testclient import TestClient
from main import app


def test_health_ok():
    client = TestClient(app)
    res = client.get('/health')
    assert res.status_code == 200
    data = res.json()
    assert data['status'] == 'ok'
    assert data['service'] == 'settlement-ai-system'
    assert data['version'] == '0.1.0'
