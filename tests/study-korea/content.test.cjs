const {test}=require('node:test'),assert=require('node:assert/strict');
const {eligible,official}=require('../../study-korea/content');
const now=new Date('2026-10-24T12:00:00Z');
const item={published:true,name_ko:'테스트',name_vi:'Thử nghiệm',location:'Busan',program:'D4',source_url:'https://university.example/admissions',verified_at:'2026-10-23'};
test('unpublished, unverified, missing source and closed records are hidden',()=>{assert(eligible(item,now));for(const change of [{published:false},{source_url:''},{source_url:'javascript:alert(1)'},{verified_at:''},{verified_at:'2026-02-30'},{verified_at:'2027-01-01'},{closes_at:'2026-10-01'}])assert.equal(eligible({...item,...change},now),false);});
test('official partnership requires confirmed contract, approval and valid expiry',()=>{assert.equal(official(item,now),false);const confirmed={...item,contract_confirmed:true,partnership_approved:true,contract_expires_at:'2027-01-01'};assert(official(confirmed,now));for(const change of [{contract_confirmed:false},{contract_confirmed:'true'},{partnership_approved:false},{contract_expires_at:'2026-01-01'}])assert.equal(official({...confirmed,...change},now),false);});
