"""Run against a local static server. Backend responses are explicitly mocked; no external submissions."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root = Path(__file__).resolve().parents[2]
out = root / 'docs' / 'study-korea-previews'
out.mkdir(exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    context = browser.new_context(viewport={'width':1440,'height':1000})
    context.route('**/*', lambda route: route.continue_() if route.request.url.startswith('http://127.0.0.1:8080') else route.abort())
    page = context.new_page()
    errors=[]
    page.on('pageerror', lambda e: errors.append(str(e)))
    endpoint='**/.netlify/functions/study-korea-inquiry'
    page.route(endpoint, lambda route: route.fulfill(json={'enabled':False}))
    page.goto('http://127.0.0.1:8080/study-korea/')
    assert page.title() == 'VR STUDENT KOREA | 한국 유학 안내'
    assert page.locator('form').count()==2
    assert page.locator('.submit:disabled').count()==2
    assert page.locator('h1').inner_text()=='한국 유학, 정확한 정보에서 시작합니다.'
    page.screenshot(path=str(out/'desktop-ko.png'),full_page=True)
    page.get_by_role('button',name='Tiếng Việt',exact=True).click()
    assert page.locator('html').get_attribute('lang')=='vi'
    assert page.locator('h1').inner_text()=='Du học Hàn Quốc bắt đầu từ thông tin đáng tin cậy.'
    page.screenshot(path=str(out/'desktop-vi.png'),full_page=True)
    for language in ['ko','vi']:
        page.locator(f'[data-lang={language}]').click()
        for width in [360,390,768,1440]:
            page.set_viewport_size({'width':width,'height':844})
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),f'Overflow: {language}, {width}'
            assert page.locator('h1 [lang='+language+']').is_visible()
            other = 'ko' if language == 'vi' else 'vi'
            assert not page.locator('h1 [lang='+other+']').is_visible()
        page.locator('summary').first.focus()
        page.keyboard.press('Enter')
        assert page.locator('details').first.get_attribute('open') is not None
        page.keyboard.press('Enter')
        assert page.locator('details').first.get_attribute('open') is None
    page.reload()
    assert page.locator('html').get_attribute('lang') == 'vi'
    assert page.locator('[name=interest]').first.locator('option[value=language]').inner_text() == 'Khóa tiếng Hàn'
    page.set_viewport_size({'width':390,'height':844})
    page.screenshot(path=str(out/'mobile-vi.png'),full_page=True)
    page.get_by_role('button',name='한국어',exact=True).click()
    page.screenshot(path=str(out/'mobile-ko.png'),full_page=True)
    # Explicit mock of an approved, connected environment, to exercise UI states.
    page.unroute(endpoint)
    requests=[]
    mode={'value':'fail'}
    def receiver(route):
        if route.request.method=='GET':
            return route.fulfill(json={'enabled':True,'version':'test-v1','policy':{'ko':'테스트 정책 (실제 접수 아님)','vi':'Chính sách thử nghiệm'}})
        requests.append(route.request.post_data_json)
        if mode['value']=='fail': return route.fulfill(status=502,json={'accepted':False})
        return route.fulfill(json={'accepted':True,'receiptId':'test-receipt'})
    page.route(endpoint,receiver)
    page.reload()
    page.locator('#student-form .submit').click()
    assert '필수' in page.locator('#student-form .form-status').inner_text()
    assert page.locator(':focus').get_attribute('name')=='name'
    f=page.locator('#student-form')
    for name,value in {'name':'테스트 학생','contact':'zalo-test','country':'Vietnam','message':'테스트 문의'}.items(): f.locator(f'[name={name}]').fill(value)
    page.locator('[data-lang=vi]').click()
    assert f.locator('[name=name]').input_value()=='테스트 학생'
    assert 'Vui lòng' in f.locator('.form-status').inner_text()
    page.locator('[data-lang=ko]').click()
    f.locator('[name=interest]').select_option('language')
    f.locator('.submit').click()
    assert '동의' in f.locator('.form-status').inner_text()
    f.locator('[name=consent]').check()
    f.locator('.submit').click()
    page.wait_for_function("document.querySelector('#student-form .form-status').textContent.includes('확인하지')")
    assert f.locator('[name=name]').input_value()=='테스트 학생'
    mode['value']='success'
    f.locator('.submit').click()
    page.wait_for_function("document.querySelector('#student-form .form-status').textContent.includes('test-receipt')")
    assert requests[0]['submissionId']==requests[1]['submissionId']
    assert f.locator('[name=name]').input_value()==''
    f=page.locator('#partner-form')
    for name,value in {'organization':'Test school','name':'테스트 담당자','email':'test@example.com','contact':'010-0000-0000','message':'테스트 협력'}.items(): f.locator(f'[name={name}]').fill(value)
    f.locator('[name=interest]').select_option('university')
    f.locator('[name=consent]').check()
    f.locator('.submit').click()
    page.wait_for_function("document.querySelector('#partner-form .form-status').textContent.includes('test-receipt')")
    assert requests[-1]['kind']=='partner'
    assert errors==[],errors
    # Check integration menu through existing language system.
    page.goto('http://127.0.0.1:8080/?lang=vi')
    assert page.locator('a[href="/study-korea/"]').inner_text()=='Du học Hàn Quốc'
    page.goto('http://127.0.0.1:8080/?lang=ko')
    assert page.locator('a[href="/study-korea/"]').inner_text()=='한국 유학'
    browser.close()
    print('PASS: Korean/Vietnamese, desktop/mobile overflow, disabled gate, validation, consent, failed delivery, idempotent retry, both forms, home menu. Screenshots:',out)
