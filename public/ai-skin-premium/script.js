(() => {
  const ACCESS_CODE = 'BUSANBLUE';
  const translations = {
    ko: {
      languageLabel: '언어', navHome: '홈', navStore: 'Store', navCompany: '회사소개', checkingAccess: 'QR access를 확인하고 있습니다.',
      invalidTitle: '프리미엄 QR 전용 서비스', invalidMessage: '프리미엄 QR 전용 서비스입니다. 제품에 포함된 QR을 통해 접속해 주세요.',
      freeAnalysisLink: '무료 AI 피부 분석 보기', storeLink: 'Store 보기', accessConfirmed: '프리미엄 QR 인증 완료',
      title: '프리미엄 AI 피부 참고 리포트', intro: '촬영 이미지를 바탕으로 피부 관심 포인트와 K-뷰티 루틴, 상담 준비 질문을 더 자세히 정리합니다.',
      benefit1: '프리미엄 AI 피부 참고 리포트', benefit2: '피부 관심 포인트 상세 정리', benefit3: 'K-뷰티 루틴 제안',
      benefit4: '제품 추천 또는 상담 연결', benefit5: '의료 진단이 아닌 상담 준비용 참고 분석', noticeTitle: '분석 전 확인해 주세요',
      noticeBody: '이 서비스는 의료 진단이나 치료 결정을 제공하지 않습니다. 촬영 이미지는 비의료적 피부 관심도 리포트 생성에만 사용됩니다.',
      startPremium: '프리미엄 분석 시작', captureTitle: '얼굴 촬영', captureHelp: '밝은 곳에서 안경과 마스크를 벗고 얼굴을 중앙 가이드 안에 맞춰 주세요.',
      alignInstruction: '얼굴을 중앙 가이드 안에 맞춰 주세요.', cameraStarting: '카메라를 준비하고 있습니다.', captureChecklistTitle: '촬영 체크',
      captureCheck1: '얼굴 전체가 타원 안에 들어오도록 합니다.', captureCheck2: '정면을 보고 그림자와 역광을 피합니다.', captureCheck3: '마스크, 선글라스, 강한 필터를 사용하지 않습니다.',
      consent: '의료 진단이 아닌 상담 준비용 참고 분석임을 확인합니다.', restartCamera: '카메라 다시 시작', captureButton: '촬영 및 분석',
      statusReady: '얼굴을 맞춘 뒤 동의 항목을 확인하고 촬영해 주세요.', statusCameraStarting: '카메라 권한을 요청하고 있습니다.', statusCameraReady: '카메라가 준비되었습니다. 얼굴을 중앙에 맞춰 주세요.',
      statusCameraError: '카메라 권한 또는 브라우저 설정을 확인해 주세요.', statusConsent: '참고 분석 고지 확인란을 먼저 선택해 주세요.', statusNeedCamera: '카메라를 먼저 시작해 주세요.',
      statusAnalyzing: '프리미엄 AI 참고 리포트를 생성하고 있습니다.', statusFace: '얼굴이 명확하지 않습니다. 중앙 가이드에 맞춰 다시 촬영해 주세요.', statusError: '분석 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.', statusDone: '프리미엄 리포트가 준비되었습니다.',
      resultTitle: '프리미엄 AI 피부 참고 리포트', overall: '종합 참고 점수', interestTitle: '피부 관심 포인트 상세 정리',
      hydrationDryness: '수분/건조 관심도', toneDullness: '피부톤/칙칙함 관심도', poreSebum: '모공/피지 관심도', wrinkleElasticity: '주름/탄력 관심도', rednessSensitivity: '홍조/민감 관심도',
      routineTitle: 'K-뷰티 루틴 제안', morning: '아침 루틴', evening: '저녁 루틴', weekly: '주간 케어', products: '제품 카테고리 제안',
      questionsTitle: '상담 시 준비할 질문', mediHanaFallbackTitle: 'Medi Hana 상담 연결', mediHanaFallbackDesc: '리포트와 현재 사용 제품, 원하는 K-뷰티 루틴을 함께 전달하면 상담 준비를 도와드립니다.',
      mediHanaButton: 'Medi Hana 상담 연결', disclaimerFallback: '본 리포트는 의료 진단이 아닌 상담 준비용 참고 분석입니다.',
      statusMissingApiKey: 'OPENAI_API_KEY가 설정되지 않았습니다.', statusInvalidImagePayload: '촬영 이미지 데이터가 올바르지 않습니다. 다시 촬영해 주세요.',
      statusOpenAiFailed: '현재 AI 상세 분석 서버 연결이 불안정합니다.', statusUnknown: '알 수 없는 오류가 발생했습니다. 기본 리포트를 표시합니다.',
      statusInvalidPremiumAccess: '프리미엄 접근 정보가 올바르지 않습니다.', fallbackTitle: '현재 AI 상세 분석 서버 연결이 불안정합니다.',
      fallbackDesc: '기본 프리미엄 참고 리포트를 먼저 제공합니다.'
    },
    en: {
      languageLabel: 'Language', navHome: 'Home', navStore: 'Store', navCompany: 'Company', checkingAccess: 'Checking QR access.',
      invalidTitle: 'Premium QR Service', invalidMessage: 'This service is available only through the premium QR. Please access it using the QR included with the product.',
      freeAnalysisLink: 'View Free AI Skin Analysis', storeLink: 'View Store', accessConfirmed: 'Premium QR verified',
      title: 'Premium AI Skin Reference Report', intro: 'Use a camera image to organize detailed skin-interest points, a K-beauty routine, and questions for consultation preparation.',
      benefit1: 'Premium AI skin reference report', benefit2: 'Detailed skin-interest summary', benefit3: 'K-beauty routine suggestions',
      benefit4: 'Product guidance or consultation connection', benefit5: 'Non-diagnostic reference analysis for consultation preparation', noticeTitle: 'Before analysis',
      noticeBody: 'This service does not provide medical diagnosis or treatment decisions. The captured image is used only to create a non-medical skin-interest report.',
      startPremium: 'Start Premium Analysis', captureTitle: 'Face Capture', captureHelp: 'Use even lighting, remove masks and tinted glasses, and align your face inside the center guide.',
      alignInstruction: 'Align your face inside the center guide.', cameraStarting: 'Preparing the camera.', captureChecklistTitle: 'Capture checklist',
      captureCheck1: 'Keep your full face inside the oval.', captureCheck2: 'Look forward and avoid shadows or backlight.', captureCheck3: 'Do not use a mask, sunglasses, or a strong filter.',
      consent: 'I confirm this is a reference analysis for consultation preparation, not a medical diagnosis.', restartCamera: 'Restart Camera', captureButton: 'Capture and Analyze',
      statusReady: 'Align your face, confirm the notice, and capture.', statusCameraStarting: 'Requesting camera permission.', statusCameraReady: 'Camera ready. Align your face in the center.',
      statusCameraError: 'Check camera permission or browser settings.', statusConsent: 'Confirm the reference-analysis notice first.', statusNeedCamera: 'Start the camera first.',
      statusAnalyzing: 'Generating your premium AI reference report.', statusFace: 'Your face is not clear enough. Align it in the center guide and try again.', statusError: 'The analysis request failed. Please try again later.', statusDone: 'Your premium report is ready.',
      resultTitle: 'Premium AI Skin Reference Report', overall: 'Overall reference score', interestTitle: 'Detailed skin-interest points',
      hydrationDryness: 'Hydration / dryness interest', toneDullness: 'Tone / dullness interest', poreSebum: 'Pore / sebum interest', wrinkleElasticity: 'Wrinkle / elasticity interest', rednessSensitivity: 'Redness / sensitivity interest',
      routineTitle: 'K-beauty routine suggestions', morning: 'Morning routine', evening: 'Evening routine', weekly: 'Weekly care', products: 'Product category suggestions',
      questionsTitle: 'Questions to prepare for consultation', mediHanaFallbackTitle: 'Connect with Medi Hana', mediHanaFallbackDesc: 'Share this report, your current products, and your K-beauty goals to prepare for a human consultation.',
      mediHanaButton: 'Connect with Medi Hana', disclaimerFallback: 'This report is a non-diagnostic reference analysis for consultation preparation.',
      statusMissingApiKey: 'OPENAI_API_KEY is not configured.', statusInvalidImagePayload: 'The captured image payload is invalid. Please capture again.',
      statusOpenAiFailed: 'The detailed AI analysis server is currently unstable.', statusUnknown: 'An unknown error occurred. A basic report is shown instead.',
      statusInvalidPremiumAccess: 'Premium access information is invalid.', fallbackTitle: 'The detailed AI analysis server is currently unstable.',
      fallbackDesc: 'A basic premium reference report is provided first.'
    },
    vi: {
      languageLabel: 'Ngôn ngữ', navHome: 'Trang chủ', navStore: 'Cửa hàng', navCompany: 'Giới thiệu', checkingAccess: 'Đang kiểm tra quyền truy cập QR.',
      invalidTitle: 'Dịch vụ QR Premium', invalidMessage: 'Đây là dịch vụ dành riêng cho QR Premium. Vui lòng truy cập bằng mã QR đi kèm sản phẩm.',
      freeAnalysisLink: 'Xem phân tích da AI miễn phí', storeLink: 'Xem cửa hàng', accessConfirmed: 'Đã xác thực QR Premium',
      title: 'Báo cáo da AI Premium tham khảo', intro: 'Dùng ảnh chụp để sắp xếp chi tiết điểm quan tâm về da, quy trình K-beauty và câu hỏi chuẩn bị tư vấn.',
      benefit1: 'Báo cáo da AI Premium tham khảo', benefit2: 'Tổng hợp chi tiết điểm quan tâm về da', benefit3: 'Gợi ý quy trình K-beauty',
      benefit4: 'Gợi ý sản phẩm hoặc kết nối tư vấn', benefit5: 'Phân tích tham khảo chuẩn bị tư vấn, không phải chẩn đoán', noticeTitle: 'Xác nhận trước khi phân tích',
      noticeBody: 'Dịch vụ không cung cấp chẩn đoán hoặc quyết định điều trị. Ảnh chỉ được dùng để tạo báo cáo quan tâm về da không mang tính y khoa.',
      startPremium: 'Bắt đầu phân tích Premium', captureTitle: 'Chụp khuôn mặt', captureHelp: 'Chọn nơi đủ sáng, bỏ khẩu trang và kính màu, rồi đặt mặt vào khung giữa.',
      alignInstruction: 'Đặt khuôn mặt vào giữa khung hướng dẫn.', cameraStarting: 'Đang chuẩn bị camera.', captureChecklistTitle: 'Kiểm tra khi chụp',
      captureCheck1: 'Đặt toàn bộ khuôn mặt trong khung bầu dục.', captureCheck2: 'Nhìn thẳng và tránh bóng tối hoặc ngược sáng.', captureCheck3: 'Không dùng khẩu trang, kính râm hoặc bộ lọc mạnh.',
      consent: 'Tôi xác nhận đây là phân tích tham khảo chuẩn bị tư vấn, không phải chẩn đoán y khoa.', restartCamera: 'Khởi động lại camera', captureButton: 'Chụp và phân tích',
      statusReady: 'Đặt mặt đúng vị trí, xác nhận thông báo rồi chụp.', statusCameraStarting: 'Đang yêu cầu quyền camera.', statusCameraReady: 'Camera đã sẵn sàng. Hãy đặt mặt ở giữa.',
      statusCameraError: 'Vui lòng kiểm tra quyền camera hoặc cài đặt trình duyệt.', statusConsent: 'Vui lòng xác nhận thông báo phân tích tham khảo.', statusNeedCamera: 'Vui lòng khởi động camera trước.',
      statusAnalyzing: 'Đang tạo báo cáo AI Premium tham khảo.', statusFace: 'Khuôn mặt chưa rõ. Hãy đặt mặt vào khung giữa và chụp lại.', statusError: 'Yêu cầu phân tích thất bại. Vui lòng thử lại sau.', statusDone: 'Báo cáo Premium đã sẵn sàng.',
      resultTitle: 'Báo cáo da AI Premium tham khảo', overall: 'Điểm tham khảo tổng hợp', interestTitle: 'Chi tiết điểm quan tâm về da',
      hydrationDryness: 'Quan tâm ẩm / khô', toneDullness: 'Quan tâm tông da / xỉn màu', poreSebum: 'Quan tâm lỗ chân lông / bã nhờn', wrinkleElasticity: 'Quan tâm nếp nhăn / đàn hồi', rednessSensitivity: 'Quan tâm đỏ / nhạy cảm',
      routineTitle: 'Gợi ý quy trình K-beauty', morning: 'Buổi sáng', evening: 'Buổi tối', weekly: 'Chăm sóc hàng tuần', products: 'Gợi ý nhóm sản phẩm',
      questionsTitle: 'Câu hỏi chuẩn bị khi tư vấn', mediHanaFallbackTitle: 'Kết nối Medi Hana', mediHanaFallbackDesc: 'Chia sẻ báo cáo, sản phẩm đang dùng và mục tiêu K-beauty để chuẩn bị tư vấn với điều phối viên.',
      mediHanaButton: 'Kết nối Medi Hana', disclaimerFallback: 'Báo cáo này là phân tích tham khảo chuẩn bị tư vấn, không phải chẩn đoán y khoa.',
      statusMissingApiKey: 'OPENAI_API_KEY chưa được thiết lập.', statusInvalidImagePayload: 'Dữ liệu ảnh chụp không hợp lệ. Vui lòng chụp lại.',
      statusOpenAiFailed: 'Máy chủ phân tích AI chi tiết hiện không ổn định.', statusUnknown: 'Đã xảy ra lỗi không xác định. Báo cáo cơ bản sẽ được hiển thị.',
      statusInvalidPremiumAccess: 'Thông tin truy cập Premium không hợp lệ.', fallbackTitle: 'Máy chủ phân tích AI chi tiết hiện không ổn định.',
      fallbackDesc: 'Báo cáo Premium tham khảo cơ bản được cung cấp trước.'
    },
    jp: {
      languageLabel: '言語', navHome: 'ホーム', navStore: 'ストア', navCompany: '会社紹介', checkingAccess: 'QRアクセスを確認しています。',
      invalidTitle: 'プレミアムQR専用サービス', invalidMessage: 'プレミアムQR専用サービスです。製品に同梱されたQRからアクセスしてください。',
      freeAnalysisLink: '無料AI肌分析を見る', storeLink: 'ストアを見る', accessConfirmed: 'プレミアムQR認証完了',
      title: 'プレミアムAI肌参考レポート', intro: '撮影画像をもとに、肌の関心ポイント、Kビューティールーティン、相談準備の質問を詳しく整理します。',
      benefit1: 'プレミアムAI肌参考レポート', benefit2: '肌の関心ポイント詳細整理', benefit3: 'Kビューティールーティン提案',
      benefit4: '製品提案または相談連携', benefit5: '医療診断ではない相談準備用参考分析', noticeTitle: '分析前にご確認ください',
      noticeBody: 'このサービスは医療診断や治療判断を提供しません。撮影画像は非医療的な肌関心レポート作成にのみ使用されます。',
      startPremium: 'プレミアム分析を開始', captureTitle: '顔撮影', captureHelp: '明るい場所でマスクや色付き眼鏡を外し、顔を中央ガイド内に合わせてください。',
      alignInstruction: '顔を中央ガイド内に合わせてください。', cameraStarting: 'カメラを準備しています。', captureChecklistTitle: '撮影チェック',
      captureCheck1: '顔全体を楕円内に収めます。', captureCheck2: '正面を向き、影や逆光を避けます。', captureCheck3: 'マスク、サングラス、強いフィルターを使用しません。',
      consent: '医療診断ではない相談準備用の参考分析であることを確認します。', restartCamera: 'カメラを再起動', captureButton: '撮影して分析',
      statusReady: '顔を合わせ、確認項目を選択して撮影してください。', statusCameraStarting: 'カメラ権限を要求しています。', statusCameraReady: 'カメラの準備ができました。顔を中央に合わせてください。',
      statusCameraError: 'カメラ権限またはブラウザ設定を確認してください。', statusConsent: '参考分析の確認項目を先に選択してください。', statusNeedCamera: '先にカメラを開始してください。',
      statusAnalyzing: 'プレミアムAI参考レポートを作成しています。', statusFace: '顔が明確ではありません。中央ガイドに合わせて再撮影してください。', statusError: '分析リクエストに失敗しました。しばらくしてから再度お試しください。', statusDone: 'プレミアムレポートが準備できました。',
      resultTitle: 'プレミアムAI肌参考レポート', overall: '総合参考スコア', interestTitle: '肌の関心ポイント詳細',
      hydrationDryness: '水分 / 乾燥関心度', toneDullness: '肌トーン / くすみ関心度', poreSebum: '毛穴 / 皮脂関心度', wrinkleElasticity: 'しわ / 弾力関心度', rednessSensitivity: '赤み / 敏感関心度',
      routineTitle: 'Kビューティールーティン提案', morning: '朝のルーティン', evening: '夜のルーティン', weekly: '週間ケア', products: '製品カテゴリー提案',
      questionsTitle: '相談時に準備する質問', mediHanaFallbackTitle: 'Medi Hana相談連携', mediHanaFallbackDesc: 'レポート、現在の製品、Kビューティーの希望を共有すると相談準備をサポートします。',
      mediHanaButton: 'Medi Hanaに相談', disclaimerFallback: '本レポートは医療診断ではない相談準備用の参考分析です。',
      statusMissingApiKey: 'OPENAI_API_KEYが設定されていません。', statusInvalidImagePayload: '撮影画像データが正しくありません。再撮影してください。',
      statusOpenAiFailed: '現在、AI詳細分析サーバーへの接続が不安定です。', statusUnknown: '不明なエラーが発生しました。基本レポートを表示します。',
      statusInvalidPremiumAccess: 'プレミアムアクセス情報が正しくありません。', fallbackTitle: '現在、AI詳細分析サーバーへの接続が不安定です。',
      fallbackDesc: '基本プレミアム参考レポートを先に提供します。'
    },
    cn: {
      languageLabel: '语言', navHome: '主页', navStore: '商店', navCompany: '公司介绍', checkingAccess: '正在确认二维码访问权限。',
      invalidTitle: '高级二维码专属服务', invalidMessage: '这是高级二维码专属服务。请通过产品中附带的二维码访问。',
      freeAnalysisLink: '查看免费AI皮肤分析', storeLink: '查看商店', accessConfirmed: '高级二维码验证完成',
      title: '高级AI皮肤参考报告', intro: '根据拍摄图像，详细整理皮肤关注点、K-Beauty护理流程和咨询准备问题。',
      benefit1: '高级AI皮肤参考报告', benefit2: '详细整理皮肤关注点', benefit3: 'K-Beauty护理流程建议',
      benefit4: '产品建议或咨询连接', benefit5: '非医疗诊断的咨询准备参考分析', noticeTitle: '分析前请确认',
      noticeBody: '本服务不提供医疗诊断或治疗决定。拍摄图像仅用于生成非医疗性质的皮肤关注报告。',
      startPremium: '开始高级分析', captureTitle: '面部拍摄', captureHelp: '请在光线均匀处摘下口罩和有色眼镜，将脸部对准中央引导框。',
      alignInstruction: '请将脸部对准中央引导框。', cameraStarting: '正在准备相机。', captureChecklistTitle: '拍摄检查',
      captureCheck1: '让整个脸部进入椭圆框。', captureCheck2: '面向正前方并避免阴影或逆光。', captureCheck3: '不要使用口罩、太阳镜或强滤镜。',
      consent: '我确认这是用于咨询准备的参考分析，不是医疗诊断。', restartCamera: '重新启动相机', captureButton: '拍摄并分析',
      statusReady: '请对准脸部、确认提示后拍摄。', statusCameraStarting: '正在请求相机权限。', statusCameraReady: '相机已准备好，请将脸部对准中央。',
      statusCameraError: '请检查相机权限或浏览器设置。', statusConsent: '请先确认参考分析提示。', statusNeedCamera: '请先启动相机。',
      statusAnalyzing: '正在生成高级AI参考报告。', statusFace: '脸部不够清晰，请对准中央引导框后重新拍摄。', statusError: '分析请求失败，请稍后重试。', statusDone: '高级报告已准备好。',
      resultTitle: '高级AI皮肤参考报告', overall: '综合参考分数', interestTitle: '皮肤关注点详细整理',
      hydrationDryness: '水分 / 干燥关注度', toneDullness: '肤色 / 暗沉关注度', poreSebum: '毛孔 / 皮脂关注度', wrinkleElasticity: '皱纹 / 弹力关注度', rednessSensitivity: '泛红 / 敏感关注度',
      routineTitle: 'K-Beauty护理流程建议', morning: '早间流程', evening: '晚间流程', weekly: '每周护理', products: '产品类别建议',
      questionsTitle: '咨询时准备的问题', mediHanaFallbackTitle: '连接Medi Hana咨询', mediHanaFallbackDesc: '分享报告、当前使用的产品和K-Beauty目标，即可获得人工咨询准备支持。',
      mediHanaButton: '连接Medi Hana', disclaimerFallback: '本报告是用于咨询准备的非医疗诊断参考分析。',
      statusMissingApiKey: '尚未设置 OPENAI_API_KEY。', statusInvalidImagePayload: '拍摄图像数据无效，请重新拍摄。',
      statusOpenAiFailed: '当前AI详细分析服务器连接不稳定。', statusUnknown: '发生未知错误，现显示基础报告。',
      statusInvalidPremiumAccess: '高级访问凭证无效。', fallbackTitle: '当前AI详细分析服务器连接不稳定。',
      fallbackDesc: '先为您提供基础高级参考报告。'
    }
  };

  const fallbackReports = {
    ko: {
      summary: '촬영 이미지는 저장하지 않고, 일반적인 K-뷰티 상담 준비 기준에 따라 기본 관심 포인트를 정리했습니다.',
      observations: [
        '세안 후 당김과 오후 건조감을 기준으로 수분 루틴을 점검해 보세요.',
        '자외선 노출과 수면 상태를 함께 기록해 피부톤 변화를 비교해 보세요.',
        'T존 번들거림과 볼 건조감의 차이를 확인해 유분 균형을 정리해 보세요.',
        '눈가와 입가의 건조감, 표정 습관을 상담 질문으로 준비해 보세요.',
        '새 제품 사용 후 붉은기나 따가움이 있었는지 기록해 보세요.'
      ],
      care: [
        '순한 세안 후 수분 제품과 보습 크림을 얇게 겹쳐 사용하세요.',
        '낮에는 자외선 차단을 기본으로 하고 제품을 한 번에 많이 바꾸지 마세요.',
        '강한 세정보다 부위별로 가벼운 보습 제형을 조절해 보세요.',
        '눈가와 입가는 마찰을 줄이고 보습 지속감을 먼저 확인하세요.',
        '새 제품은 작은 부위에 먼저 사용하고 반응을 기록하세요.'
      ],
      morning: ['순한 세안 또는 물 세안', '수분 토너나 에센스', '가벼운 보습 크림', '자외선 차단제'],
      evening: ['자극을 줄인 클렌징', '수분 또는 진정 세럼', '장벽 보습 크림', '당일 피부 느낌 기록'],
      weekly: ['주 1~2회 수분 마스크', '새 제품은 한 번에 하나씩 확인', '현재 사용하는 제품 목록 정리'],
      products: ['저자극 클렌저', '수분 토너 또는 에센스', '진정 세럼', '장벽 보습 크림', '데일리 자외선 차단제'],
      questions: ['세안 후 당김에 맞는 보습 단계는 무엇인가요?', 'T존과 볼에 다른 제형을 사용해도 될까요?', '현재 제품 중 함께 사용하지 않는 편이 좋은 조합이 있나요?', '붉은기나 민감 반응이 있을 때 우선 줄일 단계는 무엇인가요?', '아침과 저녁 루틴에서 가장 먼저 바꿀 한 가지는 무엇인가요?'],
      ctaTitle: 'Medi Hana와 기본 리포트 상담하기',
      ctaDescription: '현재 사용하는 제품과 피부 관심 포인트를 함께 보내면 상담 준비를 도와드립니다.'
    },
    en: {
      summary: 'No image-based judgment was made. This basic report organizes general K-beauty consultation preparation points.',
      observations: ['Track tightness after cleansing and dryness later in the day.', 'Compare tone changes with UV exposure and sleep patterns.', 'Note differences between T-zone oiliness and cheek dryness.', 'Prepare questions about dryness around the eyes and mouth.', 'Record any redness or stinging after using new products.'],
      care: ['Layer a hydrating product and moisturizer after gentle cleansing.', 'Keep daily sun protection and change one product at a time.', 'Adjust lightweight moisture by facial area instead of over-cleansing.', 'Reduce friction and check moisture comfort around the eyes and mouth.', 'Patch-test new products and record visible reactions.'],
      morning: ['Gentle cleanse or water rinse', 'Hydrating toner or essence', 'Light moisturizer', 'Daily sunscreen'],
      evening: ['Gentle cleansing', 'Hydrating or soothing serum', 'Barrier moisturizer', 'Record how the skin feels'],
      weekly: ['Hydrating mask once or twice', 'Introduce one new product at a time', 'Organize the current product list'],
      products: ['Gentle cleanser', 'Hydrating toner or essence', 'Soothing serum', 'Barrier moisturizer', 'Daily sunscreen'],
      questions: ['Which hydration step fits post-cleansing tightness?', 'Can I use different textures on the T-zone and cheeks?', 'Are any of my current products better used separately?', 'Which routine step should be reduced first if sensitivity appears?', 'What is the first single change to make in my routine?'],
      ctaTitle: 'Review the basic report with Medi Hana',
      ctaDescription: 'Share your current products and skin-interest points to prepare for a human consultation.'
    },
    vi: {
      summary: 'Không có đánh giá dựa trên hình ảnh. Báo cáo cơ bản này sắp xếp các điểm chuẩn bị tư vấn K-beauty chung.',
      observations: ['Ghi lại cảm giác căng sau rửa mặt và khô vào cuối ngày.', 'So sánh thay đổi tông da với nắng và giấc ngủ.', 'Theo dõi khác biệt giữa dầu vùng chữ T và khô ở má.', 'Chuẩn bị câu hỏi về vùng mắt và quanh miệng.', 'Ghi lại đỏ hoặc châm chích sau sản phẩm mới.'],
      care: ['Dùng sản phẩm cấp ẩm và kem dưỡng sau khi làm sạch dịu nhẹ.', 'Duy trì chống nắng và chỉ đổi từng sản phẩm.', 'Điều chỉnh dưỡng ẩm theo từng vùng thay vì làm sạch quá mạnh.', 'Giảm ma sát và ưu tiên độ ẩm vùng mắt, miệng.', 'Thử sản phẩm mới trên vùng nhỏ và ghi lại phản ứng.'],
      morning: ['Làm sạch dịu nhẹ', 'Toner hoặc essence cấp ẩm', 'Kem dưỡng nhẹ', 'Kem chống nắng'],
      evening: ['Làm sạch dịu nhẹ', 'Serum cấp ẩm hoặc làm dịu', 'Kem dưỡng hàng rào', 'Ghi lại cảm giác da'],
      weekly: ['Mặt nạ cấp ẩm 1-2 lần', 'Thử từng sản phẩm mới', 'Sắp xếp danh sách sản phẩm đang dùng'],
      products: ['Sữa rửa mặt dịu nhẹ', 'Toner hoặc essence cấp ẩm', 'Serum làm dịu', 'Kem dưỡng hàng rào', 'Kem chống nắng hằng ngày'],
      questions: ['Bước cấp ẩm nào phù hợp khi da căng sau rửa mặt?', 'Có thể dùng kết cấu khác nhau cho vùng chữ T và má không?', 'Sản phẩm hiện tại nào nên dùng tách riêng?', 'Nên giảm bước nào trước khi da nhạy cảm?', 'Thay đổi đầu tiên trong quy trình nên là gì?'],
      ctaTitle: 'Trao đổi báo cáo cơ bản với Medi Hana',
      ctaDescription: 'Gửi sản phẩm đang dùng và điểm quan tâm để chuẩn bị tư vấn.'
    },
    jp: {
      summary: '画像による判定は行わず、一般的なKビューティー相談準備ポイントを基本レポートとして整理しました。',
      observations: ['洗顔後のつっぱり感と午後の乾燥を記録してください。', '紫外線曝露と睡眠による肌トーンの変化を比べてください。', 'Tゾーンの皮脂と頬の乾燥の差を確認してください。', '目元・口元の乾燥について質問を準備してください。', '新製品後の赤みや刺激感を記録してください。'],
      care: ['やさしい洗顔後に水分ケアと保湿剤を重ねてください。', '日中はUVケアを続け、製品は一度に一つずつ変更してください。', '強い洗浄を避け、部位別に軽い保湿を調整してください。', '目元と口元の摩擦を減らしてください。', '新製品は小範囲で試して反応を記録してください。'],
      morning: ['やさしい洗顔', '化粧水またはエッセンス', '軽い保湿クリーム', '日焼け止め'],
      evening: ['低刺激クレンジング', '水分・鎮静セラム', 'バリア保湿クリーム', '肌の感覚を記録'],
      weekly: ['週1〜2回の水分マスク', '新製品は一つずつ確認', '使用製品リストを整理'],
      products: ['低刺激クレンザー', '水分化粧水・エッセンス', '鎮静セラム', 'バリア保湿クリーム', 'デイリーUVケア'],
      questions: ['洗顔後のつっぱりに合う保湿段階は？', 'Tゾーンと頬で異なるテクスチャーを使えますか？', '現在の製品で分けて使うべき組み合わせは？', '敏感な時に最初に減らす段階は？', '最初に変える一つの習慣は？'],
      ctaTitle: 'Medi Hanaと基本レポートを相談',
      ctaDescription: '使用中の製品と関心ポイントを共有すると相談準備を支援します。'
    },
    cn: {
      summary: '未进行基于图像的判断。本基础报告整理了一般K-Beauty咨询准备要点。',
      observations: ['记录洁面后的紧绷感和下午的干燥感。', '结合日晒和睡眠比较肤色变化。', '记录T区出油与面颊干燥的差异。', '准备眼周和嘴角干燥相关问题。', '记录使用新产品后的泛红或刺痛。'],
      care: ['温和洁面后叠加补水产品和保湿霜。', '坚持日常防晒，每次只更换一种产品。', '避免过度清洁，按不同区域调整轻薄保湿。', '减少眼周和嘴角摩擦。', '新产品先小范围试用并记录反应。'],
      morning: ['温和洁面或清水洗脸', '补水化妆水或精华水', '轻薄保湿霜', '日常防晒'],
      evening: ['温和清洁', '补水或舒缓精华', '屏障保湿霜', '记录当天皮肤感受'],
      weekly: ['每周1-2次补水面膜', '一次只尝试一种新产品', '整理当前使用产品清单'],
      products: ['温和洁面产品', '补水化妆水或精华水', '舒缓精华', '屏障保湿霜', '日常防晒霜'],
      questions: ['洁面后紧绷适合增加哪一步补水？', 'T区和面颊可以使用不同质地吗？', '当前产品中哪些更适合分开使用？', '敏感时应先减少哪一个步骤？', '护理流程最先应改变的一项是什么？'],
      ctaTitle: '通过Medi Hana咨询基础报告',
      ctaDescription: '分享当前产品和皮肤关注点，以便准备人工咨询。'
    }
  };

  const supported = ['ko', 'en', 'vi', 'jp', 'cn'];
  const normalizeLanguage = (value) => {
    const lang = String(value || '').toLowerCase();
    if (lang === 'ja') return 'jp';
    if (lang === 'zh') return 'cn';
    return supported.includes(lang) ? lang : 'ko';
  };
  const htmlLanguage = (value) => ({ jp: 'ja', cn: 'zh' })[value] || value;
  const apiLanguage = (value) => ({ jp: 'ja', cn: 'zh' })[value] || value;

  const params = new URLSearchParams(location.search);
  let language = normalizeLanguage(params.get('lang') || localStorage.getItem('vrMediTourLang') || 'ko');
  let stream = null;
  let lastResult = null;
  let lastStatusKey = 'statusReady';

  const $ = (id) => document.getElementById(id);
  const text = (key) => translations[language]?.[key] || translations.ko[key] || key;
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  const applyLanguage = (nextLanguage) => {
    language = normalizeLanguage(nextLanguage);
    localStorage.setItem('vrMediTourLang', language);
    document.documentElement.lang = htmlLanguage(language);
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      node.textContent = text(node.dataset.i18n);
    });
    document.querySelectorAll('#premiumLanguage button[data-lang]').forEach((button) => {
      const isActive = normalizeLanguage(button.dataset.lang) === language;
      button.setAttribute('aria-pressed', String(isActive));
      button.classList.toggle('active', isActive);
    });
    const nextUrl = new URL(location.href);
    nextUrl.searchParams.set('lang', language);
    history.replaceState(null, '', nextUrl);
    window.dispatchEvent(new CustomEvent('vrmt:language-change', { detail: { lang: language } }));
    setStatus(lastStatusKey);
    if (lastResult?.fallback) lastResult = buildFallbackReport(lastResult.failureCode);
    if (lastResult) renderResult(lastResult, false);
  };

  const setStatus = (key) => {
    lastStatusKey = key;
    const status = $('premiumStatus');
    if (status) status.textContent = text(key);
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach((track) => track.stop());
    stream = null;
    $('premiumCameraFrame')?.classList.remove('has-stream');
    const video = $('premiumCameraVideo');
    if (video) video.srcObject = null;
  };

  const startCamera = async () => {
    const frame = $('premiumCameraFrame');
    const video = $('premiumCameraVideo');
    if (!navigator.mediaDevices?.getUserMedia || !video) {
      setStatus('statusCameraError');
      return;
    }
    stopCamera();
    setStatus('statusCameraStarting');
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } }
      });
      video.srcObject = stream;
      await video.play();
      frame?.classList.add('has-stream');
      stream.getVideoTracks().forEach((track) => track.addEventListener('ended', () => frame?.classList.remove('has-stream'), { once: true }));
      setStatus('statusCameraReady');
    } catch (_) {
      stopCamera();
      setStatus('statusCameraError');
    }
  };

  const valueText = (value) => {
    if (typeof value === 'string') return value;
    return [
      value?.category || value?.item || value?.title,
      value?.purpose || value?.reason || value?.observation,
      value?.caution || value?.frequency
    ].filter(Boolean).join(' - ');
  };

  const listMarkup = (items) => {
    const values = (Array.isArray(items) ? items : []).map(valueText).filter(Boolean);
    return values.map((item) => `<li>${escapeHtml(item)}</li>`).join('') || '<li>-</li>';
  };

  const normalizeInterestArea = (area, fallback) => ({
    score: Math.max(0, Math.min(100, Number(area?.score ?? fallback?.score ?? 0))),
    observation: area?.observation || area?.interpretation || fallback?.interpretation || '-',
    careDirection: area?.careDirection || fallback?.careDirection || '-'
  });

  const errorStatusKey = (code) => ({
    missing_api_key: 'statusMissingApiKey',
    invalid_image_payload: 'statusInvalidImagePayload',
    openai_request_failed: 'statusOpenAiFailed',
    invalid_premium_access: 'statusInvalidPremiumAccess',
    unknown_error: 'statusUnknown'
  })[code] || 'statusUnknown';

  const buildFallbackReport = (failureCode = 'unknown_error') => {
    const copy = fallbackReports[language] || fallbackReports.ko;
    const keys = ['hydrationDryness', 'toneDullness', 'poreSebum', 'wrinkleElasticity', 'rednessSensitivity'];
    const scores = [50, 50, 50, 50, 50];
    return {
      mode: 'premium',
      fallback: true,
      failureCode,
      overallScore: 50,
      summary: copy.summary,
      interestAreas: Object.fromEntries(keys.map((key, index) => [key, {
        score: scores[index],
        observation: copy.observations[index],
        careDirection: copy.care[index]
      }])),
      morningRoutine: copy.morning,
      eveningRoutine: copy.evening,
      weeklyCare: copy.weekly,
      productCategories: copy.products,
      consultationQuestions: copy.questions,
      mediHanaCta: {
        title: copy.ctaTitle,
        description: copy.ctaDescription
      },
      disclaimer: text('disclaimerFallback')
    };
  };

  const showFallbackReport = (failureCode) => {
    lastResult = buildFallbackReport(failureCode);
    setStatus(errorStatusKey(failureCode));
    renderResult(lastResult);
  };

  const renderResult = (analysis, shouldScroll = true) => {
    const interests = analysis.interestAreas || {};
    const scores = analysis.subScores || {};
    const areas = {
      hydrationDryness: normalizeInterestArea(interests.hydrationDryness, scores.hydration),
      toneDullness: normalizeInterestArea(interests.toneDullness, scores.toneEvenness || scores.glow),
      poreSebum: normalizeInterestArea(interests.poreSebum, scores.pores || scores.oilBalance),
      wrinkleElasticity: normalizeInterestArea(interests.wrinkleElasticity, scores.texture),
      rednessSensitivity: normalizeInterestArea(interests.rednessSensitivity, scores.redness)
    };
    const routine = analysis.kBeautyRoutine || {};
    const morning = routine.morning || analysis.morningRoutine;
    const evening = routine.evening || analysis.eveningRoutine;
    const weekly = routine.weekly || analysis.weeklyCare;
    const products = analysis.productCategories || analysis.recommended_product_direction;
    const questions = analysis.consultationQuestions || (analysis.koreaConsultChecklist || []).map((item) => item?.item || item);
    const cta = analysis.mediHanaCta || {};
    const content = $('premiumResultContent');
    const resultSection = $('premiumResult');
    if (!content || !resultSection) return;

    content.innerHTML = `
      <div class="report-head">
        <span class="report-chip">BUSANBLUE PREMIUM QR REPORT</span>
        <h2 id="resultTitle">${escapeHtml(text('resultTitle'))}</h2>
        ${analysis.fallback ? `
          <div class="fallback-report-notice" role="status">
            <strong>${escapeHtml(text('fallbackTitle'))}</strong>
            <p>${escapeHtml(text('fallbackDesc'))}</p>
          </div>
        ` : ''}
        <div class="report-overall">
          <strong>${escapeHtml(Math.round(Number(analysis.overallScore) || 0))}<small>/100</small></strong>
          <div><b>${escapeHtml(text('overall'))}</b><p>${escapeHtml(analysis.summary || '-')}</p></div>
        </div>
      </div>
      <section class="report-section">
        <h3>${escapeHtml(text('interestTitle'))}</h3>
        <div class="interest-grid">
          ${Object.entries(areas).map(([key, area]) => `
            <article class="interest-card">
              <strong>${escapeHtml(text(key))}<span class="interest-score">${escapeHtml(Math.round(area.score))}/100</span></strong>
              <p>${escapeHtml(area.observation)}</p>
              <p>${escapeHtml(area.careDirection)}</p>
            </article>
          `).join('')}
        </div>
      </section>
      <section class="report-section">
        <h3>${escapeHtml(text('routineTitle'))}</h3>
        <div class="routine-grid">
          <article class="report-card"><strong>${escapeHtml(text('morning'))}</strong><ol class="report-list">${listMarkup(morning)}</ol></article>
          <article class="report-card"><strong>${escapeHtml(text('evening'))}</strong><ol class="report-list">${listMarkup(evening)}</ol></article>
          <article class="report-card"><strong>${escapeHtml(text('weekly'))}</strong><ul class="report-list">${listMarkup(weekly)}</ul></article>
          <article class="report-card"><strong>${escapeHtml(text('products'))}</strong><ul class="report-list">${listMarkup(products)}</ul></article>
        </div>
      </section>
      <section class="report-section report-card">
        <h3>${escapeHtml(text('questionsTitle'))}</h3>
        <ol class="report-list">${listMarkup(questions)}</ol>
      </section>
      <section class="medi-hana-cta">
        <h3>${escapeHtml(cta.title || text('mediHanaFallbackTitle'))}</h3>
        <p>${escapeHtml(cta.description || text('mediHanaFallbackDesc'))}</p>
        <a class="btn ai" href="/public/medi-hana/?source=BUSANBLUE-premium">${escapeHtml(text('mediHanaButton'))}</a>
      </section>
      <p class="report-disclaimer">${escapeHtml(analysis.disclaimer || text('disclaimerFallback'))}</p>
    `;
    resultSection.hidden = false;
    if (shouldScroll) resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const analyzeImage = async (imageBase64) => {
    const captureButton = $('capturePremiumBtn');
    const restartButton = $('restartCameraBtn');
    if (captureButton) captureButton.disabled = true;
    if (restartButton) restartButton.disabled = true;
    setStatus('statusAnalyzing');
    $('premiumResult').hidden = true;
    try {
      const response = await fetch('/.netlify/functions/analyze-skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          image: imageBase64,
          imageData: imageBase64,
          language: apiLanguage(language),
          lang: apiLanguage(language),
          mode: 'premium',
          premium: ACCESS_CODE,
          access: ACCESS_CODE
        })
      });
      const payload = await response.json().catch(() => null);
      const analysis = payload?.analysis;
      if (!response.ok || payload?.ok === false || !analysis) {
        const failureCode = payload?.code || 'openai_request_failed';
        console.error('Premium skin analysis failed:', {
          status: response.status,
          code: failureCode,
          message: payload?.message || payload?.error || null,
          details: payload?.details || null
        });
        showFallbackReport(failureCode);
        return;
      }
      if (analysis.faceDetected === false || analysis.canAnalyze === false) {
        setStatus('statusFace');
        return;
      }
      lastResult = analysis;
      renderResult(analysis);
      setStatus('statusDone');
    } catch (error) {
      console.error('Premium skin analysis network failure:', error);
      showFallbackReport('openai_request_failed');
    } finally {
      if (captureButton) captureButton.disabled = false;
      if (restartButton) restartButton.disabled = false;
    }
  };

  const captureAndAnalyze = async () => {
    if (!$('premiumConsent')?.checked) {
      setStatus('statusConsent');
      return;
    }
    const video = $('premiumCameraVideo');
    const canvas = $('premiumSnapshot');
    if (!stream || !video || !canvas || video.readyState < 2) {
      setStatus('statusNeedCamera');
      return;
    }
    const sourceWidth = video.videoWidth || 960;
    const sourceHeight = video.videoHeight || 720;
    const targetWidth = Math.min(sourceWidth, 1280);
    const targetHeight = Math.round((sourceHeight / sourceWidth) * targetWidth) || 960;
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      setStatus('statusError');
      return;
    }
    context.save();
    context.translate(targetWidth, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, targetWidth, targetHeight);
    context.restore();
    canvas.hidden = false;
    await analyzeImage(canvas.toDataURL('image/jpeg', 0.84));
  };

  const initialize = () => {
    applyLanguage(language);
    const validAccess = params.get('access') === ACCESS_CODE;
    $('accessLoading').hidden = true;
    if (!validAccess) {
      $('invalidAccess').hidden = false;
      return;
    }
    $('premiumApp').hidden = false;
    $('startPremiumBtn')?.addEventListener('click', async () => {
      $('introScreen').hidden = true;
      $('captureScreen').hidden = false;
      $('captureScreen').scrollIntoView({ behavior: 'smooth', block: 'start' });
      await startCamera();
    });
    $('restartCameraBtn')?.addEventListener('click', startCamera);
    $('capturePremiumBtn')?.addEventListener('click', captureAndAnalyze);
  };

  document.querySelectorAll('#premiumLanguage button[data-lang]').forEach((button) => {
    button.addEventListener('click', () => applyLanguage(button.dataset.lang));
  });
  window.addEventListener('pagehide', stopCamera);
  initialize();
})();
