import { statuses, staff, fixtures, canAccess, updateInquiry } from './model.mjs';
let lang = 'ko';
let records = fixtures();
const audit = [];
const dictionary = {
  ko: { all: '전체', new: '신규', reviewing: '검토 중', waiting: '응답 대기', completed: '상담 완료', closed: '종료', student: '학생', partner: '기관', status: '상태', assignee: '담당자', save: '모의 변경 적용', saved: '모의 데이터에만 적용했습니다. 실제 저장은 하지 않았습니다.', error: '변경을 적용하지 못했습니다. 권한·상태 전환·담당자·버전을 확인하세요.', empty: '표시할 문의가 없습니다.', count: '표시 건수', staff: { 'student-admin': '학생 담당자 A', 'partner-admin': '협력 담당자 B', 'student-admin-2': '학생 담당자 C', 'partner-admin-2': '협력 담당자 D' } },
  vi: { all: 'Tất cả', new: 'Mới', reviewing: 'Đang xem xét', waiting: 'Chờ phản hồi', completed: 'Đã tư vấn', closed: 'Đã đóng', student: 'Sinh viên', partner: 'Tổ chức', status: 'Trạng thái', assignee: 'Người phụ trách', save: 'Áp dụng thay đổi mô phỏng', saved: 'Chỉ cập nhật dữ liệu mô phỏng. Không lưu dữ liệu thật.', error: 'Không thể áp dụng. Kiểm tra quyền, chuyển trạng thái, người phụ trách và phiên bản.', empty: 'Không có yêu cầu để hiển thị.', count: 'Số yêu cầu', staff: { 'student-admin': 'Phụ trách sinh viên A', 'partner-admin': 'Phụ trách hợp tác B', 'student-admin-2': 'Phụ trách sinh viên C', 'partner-admin-2': 'Phụ trách hợp tác D' } }
};
const element = (tag, text) => { const node = document.createElement(tag); if (text) node.textContent = text; return node; };
const option = (value, text) => { const node = element('option', text); node.value = value; return node; };
function render() {
  const t = dictionary[lang];
  document.documentElement.lang = lang;
  document.title = 'VR STUDENT KOREA — ' + (lang === 'ko' ? '관리자 모의 화면' : 'Mô phỏng quản trị');
  document.querySelectorAll('[data-ko]').forEach(node => { node.textContent = node.dataset[lang]; });
  document.querySelector('#language').textContent = lang === 'ko' ? 'Tiếng Việt' : '한국어';
  const filter = document.querySelector('#status-filter');
  const selected = filter.value || 'all';
  filter.replaceChildren(...['all', ...statuses].map(value => option(value, t[value]))); filter.value = selected;
  const actor = staff.find(item => item.id === document.querySelector('#actor').value);
  const kind = document.querySelector('#kind').value;
  const visible = records.filter(record => canAccess(actor, record) && (kind === 'all' || record.kind === kind) && (selected === 'all' || record.status === selected));
  document.querySelector('#count').textContent = `${t.count}: ${visible.length}`;
  const container = document.querySelector('#records'); container.replaceChildren();
  if (!visible.length) container.append(element('p', t.empty));
  for (const record of visible) {
    const card = element('article'); card.dataset.id = record.id;
    card.append(element('h2', record.id), element('p', t[record.kind]));
    const statusLabel = element('label', t.status); const status = element('select'); status.name = 'status';
    status.append(...statuses.map(value => option(value, t[value]))); status.value = record.status; statusLabel.append(status);
    const assigneeLabel = element('label', t.assignee); const assignee = element('select'); assignee.name = 'assignee';
    const candidates = staff.filter(item => item.active && item.role === (record.kind === 'student' ? 'student_admin' : 'partner_admin'));
    assignee.append(...candidates.map(item => option(item.id, t.staff[item.id]))); assignee.value = record.assigneeId; assignee.disabled = actor.role !== 'supervisor'; assigneeLabel.append(assignee);
    const save = element('button', t.save); save.type = 'button';
    save.addEventListener('click', () => {
      try {
        const current = records.find(item => item.id === record.id);
        const updated = updateInquiry(current, { version: record.version, status: status.value, assigneeId: assignee.value }, actor);
        records = records.map(item => item.id === updated.id ? updated : item);
        audit.push({ id: updated.id, from: current.status, to: updated.status, assigneeId: updated.assigneeId });
        render(); document.querySelector('#feedback').textContent = dictionary[lang].saved;
      } catch { document.querySelector('#feedback').textContent = dictionary[lang].error; }
    });
    card.append(statusLabel, assigneeLabel, save); container.append(card);
  }
  document.querySelector('#audit').replaceChildren(...audit.filter(entry => records.some(record => record.id === entry.id && canAccess(actor, record))).map(entry => element('li', `${entry.id}: ${t[entry.from]} → ${t[entry.to]} / ${t.staff[entry.assigneeId]}`)));
  document.querySelector('#feedback').textContent = '';
}
document.querySelector('#language').addEventListener('click', () => { lang = lang === 'ko' ? 'vi' : 'ko'; render(); });
['actor', 'kind', 'status-filter'].forEach(id => document.querySelector('#' + id).addEventListener('change', render));
render();
