"""Local browser QA. API responses are mocks; no external services or real PII."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[2]
out=root/'docs/study-korea-previews';out.mkdir(exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':1440,'height':1000})
 context.route('**/*',lambda route: route.continue_() if route.request.url.startswith('http://127.0.0.1:8080') else route.abort())
 page=context.new_page(); errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 endpoint='**/.netlify/functions/study-korea-inquiry'
 page.route(endpoint,lambda route:route.fulfill(json={'enabled':False}))
 page.goto('http://127.0.0.1:8080/study-korea/')
 assert page.locator('html').get_attribute('lang')=='vi'
 assert page.locator('.submit:disabled').count()==2
 assert page.locator('#support .service').count()==4
 assert page.locator('#process li').count()==6
 assert page.locator('#brand-home').get_attribute('href')=='/?lang=vi'
 assert page.locator('#university-cards article').count()==0
 assert page.locator('[name=marketing_opt_in]').is_disabled()
 for language in ['ko','vi']:
  page.locator(f'[data-lang={language}]').click()
  for width in [360,390,430,768,1440]:
   page.set_viewport_size({'width':width,'height':844})
   assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),(language,width)
  page.screenshot(path=str(out/f'desktop-{language}.png'),full_page=True)
  page.set_viewport_size({'width':390,'height':844});page.screenshot(path=str(out/f'mobile-{language}.png'),full_page=True)
  page.locator('summary').first.focus();page.keyboard.press('Enter');assert page.locator('details').first.get_attribute('open') is not None
  page.keyboard.press('Enter')
 page.reload();assert page.locator('html').get_attribute('lang')=='vi'
 page.locator('[data-lang=ko]').click()
 page.unroute(endpoint);requests=[];mode={'value':'fail'}
 def receiver(route):
  if route.request.method=='GET':return route.fulfill(json={'enabled':True,'version':'test-v1','policy':{'ko':'테스트 정책','vi':'Chính sách thử nghiệm'},'marketing':None})
  requests.append(route.request.post_data_json)
  if mode['value']=='fail':return route.fulfill(status=502,json={'accepted':False})
  if mode['value']=='limited':return route.fulfill(status=429,json={'accepted':False})
  return route.fulfill(json={'accepted':True,'receiptId':'test-receipt'})
 page.route(endpoint,receiver);page.reload()
 f=page.locator('#student-form');f.locator('.submit').click()
 assert f.locator('.field-error').count()>0
 f.locator('[name=full_name]').fill('테스트 학생')
 f.locator('[name=contact_method]').select_option('phone')
 assert f.locator('[name=contact_value]').get_attribute('type')=='tel'
 f.locator('[name=contact_value]').fill('01012345678')
 f.locator('[name=country]').select_option('VN');f.locator('[name=program]').select_option('D4')
 f.locator('[name=privacy_ack]').check();f.locator('[name=age_ack]').check();f.locator('.submit').click()
 assert '국가번호' in f.locator('.field-error').inner_text()
 page.locator('[data-lang=vi]').click();assert 'quốc gia' in f.locator('.field-error').inner_text()
 assert f.locator('[name=full_name]').input_value()=='테스트 학생'
 page.locator('[data-lang=ko]').click();f.locator('[name=contact_value]').fill('+84901234567')
 # Submit without optional city, intake, message or marketing.
 f.locator('.submit').click();page.wait_for_function("document.querySelector('#student-form .form-status').textContent.includes('확인하지')")
 assert f.locator('[name=full_name]').input_value()=='테스트 학생'
 mode['value']='limited';f.locator('.submit').click();page.wait_for_function("document.querySelector('#student-form .form-status').textContent.includes('너무 많')")
 page.locator('[data-lang=vi]').click();assert 'Quá nhiều' in f.locator('.form-status').inner_text()
 mode['value']='success';f.locator('.submit').click();page.wait_for_function("document.querySelector('#student-form .form-status').textContent.includes('test-receipt')")
 assert len({request['submissionId'] for request in requests})==1
 assert requests[-1]['marketing_opt_in']==False
 assert requests[-1]['message']==''
 assert f.locator('[name=full_name]').input_value()==''
 assert '테스트' not in page.url
 f=page.locator('#partner-form')
 for name,value in {'organization':'Test school','full_name':'테스트 담당자','job_title':'Director','contact_value':'test@example.com'}.items():f.locator(f'[name={name}]').fill(value)
 f.locator('[name=org_type]').select_option('KOREAN_UNIVERSITY');f.locator('[name=contact_method]').select_option('email');f.locator('[name=interest]').select_option('EDUCATION')
 f.locator('.submit').click();assert f.locator('[name=privacy_ack]').get_attribute('aria-invalid')=='true'
 f.locator('[name=privacy_ack]').check();f.locator('.submit').click();page.wait_for_function("document.querySelector('#partner-form .form-status').textContent.includes('test-receipt')")
 assert requests[-1]['kind']=='partner'
 assert page.evaluate('Object.keys(localStorage)')==['vrMediTourLang']
 assert not errors,errors
 page.goto('http://127.0.0.1:8080/?lang=vi');assert page.locator('a[href="/study-korea/"]').inner_text()=='Du học Hàn Quốc'
 page.goto('http://127.0.0.1:8080/?lang=ko');assert '한국 유학' in page.locator('a[href="/study-korea/"]').inner_text()
 browser.close();print('PASS: PRD forms/optional fields, ko/vi 360/390/430/768/1440px, disabled gate, per-field errors, 429/5xx, retries across language, privacy/marketing, separate forms.')
