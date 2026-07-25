from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "running"


def test_health():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert body["model_status"] in ("trained", "untrained_demo_mode")


def test_classes():
    res = client.get("/api/v1/classes")
    assert res.status_code == 200
    body = res.json()
    assert isinstance(body["classes"], list)
    assert len(body["crops"]) >= 50
