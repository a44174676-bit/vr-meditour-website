from datetime import date, timedelta

from database import Base, SessionLocal, engine
from models import User

Base.metadata.create_all(bind=engine)
db = SessionLocal()

samples = [
    dict(name="Nguyen Thi Ha", nationality="Vietnam", language="Vietnamese", visa_type="C-3", entry_date=date.today()+timedelta(days=5), region="Seoul", korean_level="초급", stay_purpose="의료관광", medical_tourism=True, international_marriage=False, housing_status="임시숙소", community_status="없음", privacy_consent=True),
    dict(name="Tran Minh Anh", nationality="Vietnam", language="Vietnamese", visa_type="F-6", entry_date=date.today()+timedelta(days=15), region="Busan", korean_level="없음", stay_purpose="국제결혼", medical_tourism=False, international_marriage=True, housing_status="미정", community_status="없음", privacy_consent=True),
    dict(name="Lin Wei", nationality="China", language="Chinese", visa_type="D-2", entry_date=date.today()-timedelta(days=20), region="Daejeon", korean_level="중급", stay_purpose="유학", medical_tourism=False, international_marriage=False, housing_status="임시숙소", community_status="예정", privacy_consent=True),
]

for s in samples:
    exists = db.query(User).filter(User.name == s["name"]).first()
    if not exists:
        db.add(User(**s))

db.commit()
db.close()
print("Seed complete")
