// الأسئلة الافتراضية
const DEFAULT_QUESTIONS = [
    "يمكنني التحدث بحرية إذا رأيت شيئاً قد يؤثر على سلامة الأغذية",
    "يتم تشجيعي على تقديم اقتراحات لتحسين ممارسات سلامة الأغذية",
    "توفر الإدارة معلومات كافية وفي الوقت المناسب عن القواعد والأنظمة الحالية لسلامة الأغذية",
    "يقدم مديري بشكل عام التعليمات والتدريب المناسبين بشأن تصنيع الأغذية",
    "سياسات وإجراءات سلامة الغذاء لدينا تعطي إرشادات مفصلة للممارسات",
    "جميع المعلومات الضرورية للتعامل مع سلامة الأغذية متاحة لي",
    "تبين إجراءات المديرين أن توفير سلامة الأغذية للعملاء يمثل أولوية قصوى",
    "سلامة الغذاء هي أولوية قصوى بالنسبة لي",
    "أتبع قواعد سلامة الأغذية لأنني أعتقد أنها مهمة",
    "أتبع قواعد سلامة الأغذية لأنه من مسؤوليتي القيام بذلك",
    "يشارك مديري بشكل نشط للتأكد من التداول الآمن للأغذية",
    "تقوم الإدارة بتطبيق قواعد سلامة الأغذية باستمرار مع جميع الموظفين",
    "تتوفر الإمدادات الكافية (مثل القفازات، الكمامات، غطاء الشعر، إلخ) بسهولة لأداء ممارسات آمنة",
    "إن الوسائل اللازمة لإعداد الأغذية بأمان (مثل أحواض غسيل اليدين) متاحة ومتاحة بسهولة",
    "تدريب سلامة الأغذية الذي توفرها الإدارة مفيد في تحسين ممارساتي",
    "إن زملائي في العمل داعمون لبعضهم البعض فيما يتعلق بسلامة الأغذية",
    "يذكر الموظفون بعضهم البعض باتباع ممارسات سلامة الأغذية",
    "يعمل الموظفون الجدد والموظفون ذوو الخبرة معاً لضمان تطبيق ممارسات سلامة الأغذية",
    "هناك تعاون جيد بين الإدارات لضمان حصول العملاء على أغذية آمنة",
    "الموظفون منضبطون أو يتعرضون للتوبيخ عندما يفشلون في متابعة سلامة الغذاء",
    "تساعد سياساتنا وإجراءاتنا المتعلقة بسلامة الأغذية على ضمان اتباع ممارسات تداول الأغذية المأمونة",
    "لا يتم تقديم أي تنازلات عن الممارسات الآمنة عند التعامل مع الأغذية",
    "لدى الإدارة صورة واضحة عن المخاطر المرتبطة بممارسات سلامة الأغذية غير السليمة",
    "لن تأخذ الإدارة حتى مخاطرة صغيرة عندما يتعلق الأمر بسلامة الأغذية"
];

function initDefaultQuestions() {
    const questions = getQuestions();
    if (questions.length === 0) {
        const defaultQuestionsObjs = DEFAULT_QUESTIONS.map((text, index) => ({
            id: Date.now() + index,
            text: text
        }));
        saveQuestions(defaultQuestionsObjs);
    }
}

window.onload = function () {
    initDefaultQuestions();
    showSurvey();
};

const ADMIN_PASSWORD = "123";
const ADMIN_USERNAME = "admin";

function showLogin() {
    hideAllPages();
    document.getElementById('loginPage').classList.add('active');
}

function performLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        showAdmin();
    } else {
        alert("اسم المستخدم أو كلمة المرور غير صحيحة!");
    }
}

function logout() {
    sessionStorage.removeItem('isAdminLoggedIn');
    showSurvey();
}

function checkLoginStatus() {
    return sessionStorage.getItem('isAdminLoggedIn') === 'true';
}

function showAdmin() {
    if (!checkLoginStatus()) {
        showLogin();
        return;
    }
    hideAllPages();
    document.getElementById('adminPage').classList.add('active');
    displayQuestions();
}

function showSurvey() {
    const questions = getQuestions();
    if (questions.length === 0) {
        alert('الرجاء إضافة أسئلة أولاً');
        return;
    }
    hideAllPages();
    document.getElementById('surveyPage').classList.add('active');
    loadSurveyQuestions();
}

function showResults() {
    if (!checkLoginStatus()) {
        showLogin();
        return;
    }
    hideAllPages();
    document.getElementById('resultsPage').classList.add('active');
    displaySubmissions();
    displayStats();
}

function hideAllPages() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
}

function getQuestions() {
    try {
        return JSON.parse(localStorage.getItem('surveyQuestions') || '[]');
    } catch (e) {
        console.error('Error parsing surveyQuestions', e);
        return [];
    }
}

function saveQuestions(questions) {
    localStorage.setItem('surveyQuestions', JSON.stringify(questions));
}

function addQuestion(event) {
    const questionText = document.getElementById('newQuestion').value.trim();

    if (!questionText) {
        alert('الرجاء كتابة السؤال');
        return;
    }

    const questions = getQuestions();
    questions.push({
        id: Date.now(),
        text: questionText
    });

    saveQuestions(questions);
    document.getElementById('newQuestion').value = '';
    displayQuestions();

    const btn = event.target;
    btn.textContent = '✓ تم الإضافة';
    btn.style.background = '#48bb78';
    setTimeout(() => {
        btn.textContent = '➕ إضافة السؤال';
        btn.style.background = '';
    }, 1500);
}

function displayQuestions() {
    const questions = getQuestions();
    const container = document.getElementById('questionsList');
    const countElement = document.getElementById('questionCount');

    countElement.textContent = questions.length;

    if (questions.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #a0aec0; padding: 40px;">لا توجد أسئلة حتى الآن. ابدأ بإضافة سؤال!</p>';
        return;
    }

    container.innerHTML = questions.map((q, index) => `
        <div class="question-item">
            <span class="question-number">${index + 1}</span>
            <p class="question-text">${q.text}</p>
            <button onclick="deleteQuestion(${q.id})" class="question-delete">حذف</button>
        </div>
    `).join('');
}

function deleteQuestion(id) {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;

    let questions = getQuestions();
    questions = questions.filter(q => q.id !== id);
    saveQuestions(questions);
    displayQuestions();
}

function loadSurveyQuestions() {
    const questions = getQuestions();
    const container = document.getElementById('surveyQuestions');

    container.innerHTML = questions.map((q, index) => `
        <div class="survey-question">
            <p class="survey-question-text">${index + 1}. ${q.text}</p>
            <div class="radio-group">
                ${['موافق', 'محايد', 'غير موافق'].map(option => `
                    <label class="radio-label">
                        <input type="radio" name="question_${q.id}" value="${option}" required>
                        <span class="radio-text">${option}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('') + `
    <!-- الأسئلة المقالية -->
    <div class="survey-section" style="margin-top: 30px; border-top: 2px solid #e2e8f0; padding-top: 20px;">
        <label style="display:block; margin-bottom: 10px; font-weight:bold;">1. هل لديك أي اقتراحات أو تعليقات للتحسين من درجة الجودة، السلامة، الشرعية، والمحافظة على هوية المنتج؟</label>
        <textarea id="essay_suggestions" class="form-input" rows="3" style="width:100%;"></textarea>
    </div>
    <div class="survey-section" style="margin-top: 20px;">
        <label style="display:block; margin-bottom: 10px; font-weight:bold;">2. ما هي الأشياء من وجهة نظرك التي بها قصور في التطبيق لسلامة وجودة وشرعية وهوبة المنتج؟</label>
        <textarea id="essay_deficiencies" class="form-input" rows="3" style="width:100%;"></textarea>
    </div>
    <div class="survey-section" style="margin-top: 20px;">
        <label style="display:block; margin-bottom: 10px; font-weight:bold;">3. ما هي الأنشطة المقترحة لتحقيق الأهداف بشكل أفضل؟</label>
        <textarea id="essay_activities" class="form-input" rows="3" style="width:100%;"></textarea>
    </div>
    `;
}

function submitSurvey(event) {
    event.preventDefault();

    const employeeName = document.getElementById('employeeName').value;
    const department = document.getElementById('department').value;
    const questions = getQuestions();

    const responses = questions.map(q => {
        const answer = document.querySelector(`input[name="question_${q.id}"]:checked`);
        return {
            questionId: q.id,
            questionText: q.text,
            answer: answer ? answer.value : ''
        };
    });

    const surveyResponse = {
        id: Date.now(),
        employeeName,
        department,
        responses,
        date: new Date().toLocaleString('ar-EG', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }),
        essayAnswers: {
            suggestions: document.getElementById('essay_suggestions').value || '',
            deficiencies: document.getElementById('essay_deficiencies').value || '',
            activities: document.getElementById('essay_activities').value || ''
        }
    };

    let allResponses = [];
    try {
        allResponses = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
    } catch (e) {
        console.error('Error parsing surveyResponses', e);
        allResponses = [];
    }
    allResponses.push(surveyResponse);
    localStorage.setItem('surveyResponses', JSON.stringify(allResponses));

    document.getElementById('surveyForm').classList.add('hidden');
    document.getElementById('successMessage').classList.remove('hidden');
}

function resetSurvey() {
    document.getElementById('surveyForm').reset();
    document.getElementById('surveyForm').classList.remove('hidden');
    document.getElementById('successMessage').classList.add('hidden');
}

function displaySubmissions() {
    let responses = [];
    try {
        responses = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
    } catch (e) {
        console.error('Error parsing surveyResponses', e);
    }
    const tbody = document.getElementById('resultsBody');

    if (responses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: #a0aec0;">لا توجد استبيانات مرسلة حتى الآن</td></tr>';
        return;
    }

    let rows = '';
    for (let i = responses.length - 1; i >= 0; i--) {
        const response = responses[i];
        rows += `
            <tr>
                <td style="font-weight: bold;">${response.employeeName}</td>
                <td>${response.department}</td>
                <td>${response.date}</td>
                <td style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="exportSingleSubmission(${response.id})" class="btn btn-success" style="padding: 5px 15px; font-size: 0.9em;">
                        📥 تحميل Excel
                    </button>
                    <button onclick="deleteSubmission(${response.id})" class="btn btn-danger" style="padding: 5px 15px; font-size: 0.9em; background: #e53e3e;">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    }
    tbody.innerHTML = rows;
}

function deleteSubmission(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الاستبيان؟')) return;

    let responses = [];
    try {
        responses = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
    } catch (e) { return; }

    const newResponses = responses.filter(r => r.id !== id);
    localStorage.setItem('surveyResponses', JSON.stringify(newResponses));

    displaySubmissions();
    displayStats();
}

function exportSingleSubmission(id) {
    if (typeof XLSX === 'undefined') {
        alert('مكتبة Excel غير محملة');
        return;
    }

    const responses = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
    const submission = responses.find(r => r.id === id);

    if (!submission) {
        alert('البيانات غير موجودة');
        return;
    }

    let formattedDate = submission.date.split(',')[0];

    let data = [
        ['', 'شركة جنى فريش', '', '', 'رقم الوثيقة: FSP-14-01'],
        ['', 'إجراء ثقافة سلامة الغذاء', '', '', 'تاريخ الإصدار: 1/11/2023'],
        ['', 'إستبيان ثقافة سلامة الغذاء', '', '', 'إصدار/تعديل: 0/1'],
        ['', 'اسم الموظف: ' + submission.employeeName, '', 'القسم: ' + submission.department, 'التاريخ: ' + formattedDate],
        ['', '', '', '', ''],
        ['م', 'بنود الإستبيان', 'غير موافق', 'محايد', 'أوافق']
    ];

    submission.responses.forEach((r, index) => {
        const checkMark = '✓';
        const isAgree = r.answer === 'موافق' ? checkMark : '';
        const isNeutral = r.answer === 'محايد' ? checkMark : '';
        const isDisagree = r.answer === 'غير موافق' || r.answer === 'لا أوافق' ? checkMark : '';

        data.push([
            index + 1,
            r.questionText,
            isDisagree,
            isNeutral,
            isAgree
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);

    const wscols = [
        { wch: 5 },
        { wch: 80 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 }
    ];
    ws['!cols'] = wscols;

    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push(
        { s: { r: 0, c: 1 }, e: { r: 0, c: 3 } },
        { s: { r: 1, c: 1 }, e: { r: 1, c: 3 } },
        { s: { r: 2, c: 1 }, e: { r: 2, c: 3 } }
    );

    // إضافة الأقسام المقالية
    XLSX.utils.sheet_add_aoa(ws, [
        ['', '', '', '', ''],
        ['', 'هل لديك أي اقتراحات أو تعليقات للتحسين من درجة الجودة، السلامة، الشرعية، والمحافظة على هوية المنتج؟', '', '', ''],
        ['1', submission.essayAnswers?.suggestions || '', '', '', ''],
        ['2', '', '', '', ''],
        ['3', '', '', '', ''],
        ['', '', '', '', ''],
        ['', 'ما هي الأشياء من وجهة نظرك التي بها قصور في التطبيق لسلامة وجودة وشرعية وهوبة المنتج؟', '', '', ''],
        ['1', submission.essayAnswers?.deficiencies || '', '', '', ''],
        ['2', '', '', '', ''],
        ['3', '', '', '', ''],
        ['', '', '', '', ''],
        ['', 'ما هي الأنشطة المقترحة لتحقيق الأهداف بشكل أفضل؟', '', '', ''],
        ['1', submission.essayAnswers?.activities || '', '', '', ''],
        ['2', '', '', '', ''],
        ['3', '', '', '', '']
    ], { origin: -1 });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'النموذج');

    const safeName = submission.employeeName.replace(/[^a-z0-9\u0600-\u06FF]/gi, '_');
    const filename = `FSP-14-01_${safeName}.xlsx`;
    XLSX.writeFile(wb, filename);
}

function exportToExcel() {
    if (typeof XLSX === 'undefined') {
        alert('عذراً، مكتبة Excel لم يتم تحميلها بشكل صحيح. يرجى التأكد من الاتصال بالإنترنت.');
        return;
    }

    let responses = [];
    try {
        responses = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
    } catch (e) {
        console.error('Error parsing surveyResponses', e);
        alert('حدث خطأ في قراءة البيانات المخزنة.');
        return;
    }

    if (responses.length === 0) {
        alert('لا توجد بيانات للتصدير');
        return;
    }

    let data = [
        ['شركة جنى فريش', '', '', 'رقم الوثيقة: FSP-14-01'],
        ['إجراء ثقافة سلامة الغذاء', '', '', 'تاريخ الإصدار: 1/11/2023'],
        ['نتائج الاستبيان', '', '', 'إصدار/تعديل: 0/1'],
        ['', '', '', ''],
        ['القسم', 'السؤال', 'الإجابة', 'التاريخ']
    ];

    responses.forEach(response => {
        let formattedDate = response.date;
        try {
            formattedDate = response.date.split(',')[0];
        } catch (e) {
            console.error('Date formatting error', e);
        }

        response.responses.forEach(r => {
            data.push([
                response.department,
                r.questionText,
                r.answer,
                formattedDate
            ]);
        });
    });

    const ws = XLSX.utils.aoa_to_sheet(data);

    const wscols = [
        { wch: 25 },
        { wch: 80 },
        { wch: 15 },
        { wch: 20 }
    ];
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'نتائج الاستبيان');

    const filename = `FSP-14-01_نتائج_استبيان_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, filename);
}

function displayStats() {
    // يمكن إضافة إحصائيات هنا إذا لزم الأمر
}

function clearAllData() {
    if (!confirm('هل أنت متأكد من حذف جميع الإجابات?\nهذا الإجراء لا يمكن التراجع عنه!')) return;

    localStorage.removeItem('surveyResponses');
    displaySubmissions();
    displayStats();
    alert('✓ تم حذف جميع الإجابات بنجاح');
}