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

// Firebase Helpers
async function getQuestionsFromCloud() {
    try {
        const q = window.firebaseQuery(window.firebaseCollection(window.firebaseDb, "questions"), window.firebaseOrderBy("id"));
        const snapshot = await window.firebaseGetDocs(q);
        const questions = [];
        snapshot.forEach((doc) => {
            questions.push({ ...doc.data(), docId: doc.id });
        });
        return questions;
    } catch (e) {
        console.error("Error fetching questions: ", e);
        return [];
    }
}

async function addQuestionToCloud(questionObj) {
    try {
        await window.firebaseAddDoc(window.firebaseCollection(window.firebaseDb, "questions"), questionObj);
    } catch (e) {
        console.error("Error adding question: ", e);
        throw e;
    }
}

async function deleteQuestionFromCloud(docId) {
    try {
        await window.firebaseDeleteDoc(window.firebaseDoc(window.firebaseDb, "questions", docId));
    } catch (e) {
        console.error("Error deleting question: ", e);
        throw e;
    }
}

async function saveSubmissionToCloud(submission) {
    await window.firebaseAddDoc(window.firebaseCollection(window.firebaseDb, "submissions"), submission);
}

async function getSubmissionsFromCloud() {
    try {
        const q = window.firebaseQuery(window.firebaseCollection(window.firebaseDb, "submissions"), window.firebaseOrderBy("timestamp", "desc"));
        const snapshot = await window.firebaseGetDocs(q);
        const submissions = [];
        snapshot.forEach((doc) => {
            submissions.push({ ...doc.data(), docId: doc.id });
        });
        return submissions;
    } catch (e) {
        console.error("Error fetching submissions: ", e);
        return [];
    }
}

async function deleteSubmissionFromCloud(docId) {
    await window.firebaseDeleteDoc(window.firebaseDoc(window.firebaseDb, "submissions", docId));
}

// Initialization
async function initDefaultQuestions() {
    const questions = await getQuestionsFromCloud();
    if (questions.length === 0) {
        // Add defaults if empty
        console.log("Initializing default questions...");
        for (let i = 0; i < DEFAULT_QUESTIONS.length; i++) {
            await addQuestionToCloud({
                id: Date.now() + i,
                text: DEFAULT_QUESTIONS[i]
            });
        }
    }
}

window.onload = function () {
    // Force scroll to top
    window.scrollTo(0, 0);
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    if (window.firebaseDb) {
        initDefaultQuestions();
    } else {
        console.error("Firebase not initialized yet");
    }

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
}

function hideAllPages() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
}

async function addQuestion(event) {
    const btn = event.target;
    const questionText = document.getElementById('newQuestion').value.trim();

    if (!questionText) {
        alert('الرجاء كتابة السؤال');
        return;
    }

    btn.textContent = '⏳ جاري الإضافة...';
    btn.disabled = true;

    try {
        await addQuestionToCloud({
            id: Date.now(),
            text: questionText
        });

        document.getElementById('newQuestion').value = '';
        displayQuestions();

        btn.textContent = '✓ تم الإضافة';
        btn.style.background = '#48bb78';
        setTimeout(() => {
            btn.textContent = '➕ إضافة السؤال';
            btn.style.background = '';
            btn.disabled = false;
        }, 1500);

    } catch (e) {
        alert('حدث خطأ أثناء إضافة السؤال');
        btn.textContent = '➕ إضافة السؤال';
        btn.disabled = false;
    }
}

async function displayQuestions() {
    const container = document.getElementById('questionsList');
    container.innerHTML = '<p style="text-align:center;">جاري تحميل الأسئلة...</p>';

    const questions = await getQuestionsFromCloud();
    const countElement = document.getElementById('questionCount');

    countElement.textContent = questions.length;

    if (questions.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #a0aec0; padding: 40px;">لا توجد أسئلة حتى الآن.</p>';
        return;
    }

    container.innerHTML = questions.map((q, index) => `
        <div class="question-item">
            <span class="question-number">${index + 1}</span>
            <p class="question-text">${q.text}</p>
            <button onclick="deleteQuestion('${q.docId}')" class="question-delete">حذف</button>
        </div>
    `).join('');
}

async function deleteQuestion(docId) {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
    await deleteQuestionFromCloud(docId);
    displayQuestions();
}

async function loadSurveyQuestions() {
    const container = document.getElementById('surveyQuestions');
    container.innerHTML = '<p style="text-align:center; padding:20px;">جاري تحميل الاستبيان...</p>';

    const questions = await getQuestionsFromCloud();

    if (questions.length === 0) {
        container.innerHTML = '<p style="text-align:center;">الرجاء إضافة أسئلة من لوحة التحكم</p>';
        return;
    }

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

async function submitSurvey(event) {
    event.preventDefault();

    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '⏳ جاري الإرسال...';
    btn.disabled = true;

    try {
        const employeeName = document.getElementById('employeeName').value;
        const department = document.getElementById('department').value;
        const questions = await getQuestionsFromCloud();

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
            timestamp: window.firebaseTimestamp.now(), // Use Firestore timestamp
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

        await saveSubmissionToCloud(surveyResponse);

        document.getElementById('surveyForm').classList.add('hidden');
        document.getElementById('successMessage').classList.remove('hidden');

    } catch (e) {
        console.error(e);
        alert('حدث خطأ أثناء إرسال البيانات. تأكد من اتصالك بالإنترنت.');
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

function resetSurvey() {
    document.getElementById('surveyForm').reset();
    document.getElementById('surveyForm').classList.remove('hidden');
    document.getElementById('successMessage').classList.add('hidden');
    // Scroll to top
    window.scrollTo(0, 0);
}

async function displaySubmissions() {
    const tbody = document.getElementById('resultsBody');
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">جاري تحميل البيانات...</td></tr>';

    const responses = await getSubmissionsFromCloud();

    if (responses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: #a0aec0;">لا توجد استبيانات مرسلة حتى الآن</td></tr>';
        return;
    }

    let rows = '';
    for (let i = 0; i < responses.length; i++) {
        const response = responses[i];
        rows += `
            <tr>
                <td style="font-weight: bold;">${response.employeeName}</td>
                <td>${response.department}</td>
                <td>${response.date}</td>
                <td style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="exportSingleSubmission('${response.docId}')" class="btn btn-success" style="padding: 5px 15px; font-size: 0.9em;">
                        📥 تحميل Excel
                    </button>
                    <button onclick="deleteSubmission('${response.docId}')" class="btn btn-danger" style="padding: 5px 15px; font-size: 0.9em; background: #e53e3e;">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    }
    tbody.innerHTML = rows;
}

async function deleteSubmission(docId) {
    if (!confirm('هل أنت متأكد من حذف هذا الاستبيان؟')) return;
    await deleteSubmissionFromCloud(docId);
    displaySubmissions();
}


async function exportSingleSubmission(docId) {
    const responses = await getSubmissionsFromCloud();
    const submission = responses.find(r => r.docId === docId);

    if (!submission) {
        alert('البيانات غير موجودة');
        return;
    }

    try {
        // Encode the path to handle Arabic characters
        const folderName = encodeURIComponent("إستبيان ثقافة سلامة الغذاء_files");
        const fileName = "sheet001.htm";
        const url = `${folderName}/${fileName}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Template file not found');

        let htmlContent = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        // Helper to find cell by text content (approximate match)
        function findCellByText(text) {
            const cells = doc.querySelectorAll('td');
            for (let cell of cells) {
                if (cell.textContent.includes(text)) return cell;
            }
            return null;
        }

        // 1. Inject Date and Department (Skipping Employee Name as requested)
        const deptLabel = findCellByText('القسم:');
        if (deptLabel && deptLabel.nextElementSibling) {
            deptLabel.textContent = 'القسم: ' + submission.department;
        }

        const dateLabel = findCellByText('التاريخ:');
        if (dateLabel) {
            let formattedDate = submission.date.split(',')[0];
            dateLabel.textContent = 'التاريخ: ' + formattedDate;
        }

        // 2. Inject Answers (Checkmarks)
        // This logic assumes specific table structure. 
        // We will loop through rows and try to match question text.
        const rows = doc.querySelectorAll('tr');

        submission.responses.forEach(r => {
            for (let row of rows) {
                // Find row containing the question text
                if (row.textContent.includes(r.questionText.substring(0, 20))) { // Match first 20 chars to be safe
                    const cells = row.querySelectorAll('td');
                    // Check cells for columns (Disagree, Neutral, Agree) - usually indices 2, 3, 4 based on typical layout
                    // Adjust indices based on visual inspection or standard layout: 
                    // Col 1: Question, Col 2: Disagree, Col 3: Neutral, Col 4: Agree

                    // Let's try to identify columns by header if possible, otherwise assume standard order
                    // Assuming standard order: [Question] [Disagree] [Neutral] [Agree]

                    let targetIndex = -1;
                    if (r.answer === 'موافق') targetIndex = 4; // 5th cell (0-indexed? check layout)
                    else if (r.answer === 'محايد') targetIndex = 3;
                    else if (r.answer === 'غير موافق' || r.answer === 'لا أوافق') targetIndex = 2;

                    // Heuristic: The question is usually in a wide cell. The checkboxes are small cells following it.
                    // Let's find the cell with the question text first.
                    let questionCellIndex = -1;
                    cells.forEach((c, idx) => {
                        if (c.textContent.includes(r.questionText.substring(0, 20))) questionCellIndex = idx;
                    });

                    if (questionCellIndex !== -1) {
                        // Ensure we have enough cells
                        if (r.answer === 'غير موافق' && cells[questionCellIndex + 1]) cells[questionCellIndex + 1].textContent = '✓';
                        if (r.answer === 'محايد' && cells[questionCellIndex + 2]) cells[questionCellIndex + 2].textContent = '✓';
                        if (r.answer === 'موافق' && cells[questionCellIndex + 3]) cells[questionCellIndex + 3].textContent = '✓';
                    }
                    break;
                }
            }
        });

        // 3. Inject Essay Answers
        // Need to find where to put them. Assuming placeholders or specific text exists.
        // We will append them to the bottom/end of table if specific place not found, OR find header text.

        const essayMap = {
            'هل لديك أي اقتراحات': submission.essayAnswers?.suggestions,
            'ما هي الأشياء من وجهة نظرك التي بها قصور': submission.essayAnswers?.deficiencies,
            'ما هي الأنشطة المقترحة': submission.essayAnswers?.activities
        };

        for (let [key, value] of Object.entries(essayMap)) {
            if (!value) continue;
            // Find the header row
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].textContent.includes(key)) {
                    // Inject in the NEXT row(s)
                    if (rows[i + 1]) {
                        const targetCell = rows[i + 1].querySelector('td');
                        if (targetCell) targetCell.textContent = value;
                    }
                    break;
                }
            }
        }

        // 4. Download
        const serializer = new XMLSerializer();
        const newHtml = serializer.serializeToString(doc);
        const blob = new Blob([newHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const downloadUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = downloadUrl;
        const safeName = submission.employeeName.replace(/[^a-z0-9\u0600-\u06FF]/gi, '_'); // Keep for filename only
        a.download = `FSP-14-01_${safeName}.xls`; // Changed to .xls to open correctly as HTML-Excel
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);

    } catch (e) {
        console.error('Export Error:', e);
        alert('حدث خطأ في تصدير القالب. تأكد من وجود ملف sheet001.htm في المجلد الصحيح.');
    }
}


async function exportToExcel() {
    if (typeof XLSX === 'undefined') {
        alert('مكتبة Excel غير موجودة');
        return;
    }

    const responses = await getSubmissionsFromCloud();

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
        } catch (e) { }

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

    const filename = `نتائج_استبيان_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, filename);
}

function displayStats() {
    // Stats functionality
}

async function clearAllData() {
    if (!confirm('هل أنت متأكد من حذف جميع الإجابات?\nهذا الإجراء سيحذف البيانات من السحابة ولا يمكن التراجع عنه!')) return;

    const responses = await getSubmissionsFromCloud();
    for (let r of responses) {
        await deleteSubmissionFromCloud(r.docId);
    }

    displaySubmissions();
    alert('✓ تم حذف جميع الإجابات بنجاح');
}