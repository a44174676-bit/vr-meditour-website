from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[2]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1280,'height':900})
    errors=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.route('**/*',lambda route: route.continue_() if route.request.url.startswith('http://127.0.0.1:8080') else route.abort())
    page.goto('http://127.0.0.1:8080/dev-tools/study-korea-admin/')
    assert page.locator('article').count()==4
    card=page.locator('article[data-id=DEMO-S01]')
    card.locator('[name=status]').select_option('reviewing')
    card.locator('[name=assignee]').select_option('student-admin-2')
    card.locator('button').click()
    assert '실제 저장은 하지 않았습니다' in page.locator('#feedback').inner_text()
    assert page.locator('#audit li').count()==1
    page.locator('#actor').select_option('student-admin')
    assert page.locator('article').count()==1
    assert page.locator('article [name=assignee]').is_disabled()
    page.locator('#actor').select_option('partner-admin')
    assert page.locator('article').count()==2
    page.locator('#actor').select_option('anonymous')
    assert page.locator('article').count()==0
    assert page.locator('#audit li').count()==0
    page.locator('#actor').select_option('supervisor')
    page.locator('#status-filter').select_option('reviewing')
    assert page.locator('article').count()==2
    page.locator('#status-filter').select_option('all')
    page.screenshot(path=str(root/'docs/study-korea-previews/admin-desktop.png'),full_page=True)
    for language in ['ko','vi']:
        if language=='vi': page.locator('#language').click()
        for width in [360,390,768,1280]:
            page.set_viewport_size({'width':width,'height':844})
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),(language,width)
    page.set_viewport_size({'width':390,'height':844})
    page.screenshot(path=str(root/'docs/study-korea-previews/admin-mobile.png'),full_page=True)
    page.reload()
    assert page.locator('article[data-id=DEMO-S01] [name=status]').input_value()=='new'
    assert page.locator('#audit li').count()==0
    assert not page.evaluate('Object.keys(localStorage).length')
    assert not errors, errors
    browser.close()
    print('PASS: mock status/assignment, role visibility, filters, reset on reload, no browser persistence, ko/vi responsive.')
