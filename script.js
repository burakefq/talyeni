// Firebase kütüphanelerini içe aktar
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Bu kısım Firebase konsolundan kopyaladığın ayarlar olmalı.
const firebaseConfig = {
    apiKey: "AIzaSyBZ53NTzXj6T_pGL0g0S3kCb66ThTXN-TE",
    authDomain: "torbali-anadolu-lisesi-869d8.firebaseapp.com",
    projectId: "torbali-anadolu-lisesi-869d8",
    storageBucket: "torbali-anadolu-lisesi-869d8.appspot.com",
    messagingSenderId: "366694577825",
    appId: "1:366694577825:web:f0f80bad77faaa368922e0",
    measurementId: "G-2LXL8T8P3LE"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const studentsRef = ref(db, 'students');

// Açılış ekranı ve giriş panelini yönetir
const splashScreen = document.getElementById('splash-screen');
const loginContainer = document.getElementById('login-container');

if (splashScreen && loginContainer) {
    setTimeout(() => {
        splashScreen.style.display = 'none';
        loginContainer.style.display = 'block';
    }, 3000);

    const studentBtn = document.getElementById('student-btn');
    const teacherBtn = document.getElementById('teacher-btn');
    const studentLoginForm = document.getElementById('student-login');
    const teacherLoginForm = document.getElementById('teacher-login');
    const studentNameInput = document.getElementById('student-name-input');
    const studentLoginBtn = document.getElementById('student-login-btn');
    const teacherPasswordInput = document.getElementById('teacher-password-input');
    const teacherLoginBtn = document.getElementById('teacher-login-btn');

    // Öğrenci Girişi
    studentBtn.addEventListener('click', () => {
        studentLoginForm.style.display = 'block';
        teacherLoginForm.style.display = 'none';
        studentBtn.classList.add('active');
        teacherBtn.classList.remove('active');
    });

    studentLoginBtn.addEventListener('click', () => {
        const name = studentNameInput.value.trim();
        const students = [
            "Ali Yılmaz", "Ayşe Can", "Mehmet Demir", "Fatma Kaya", "Emre Çelik",
            "Zeynep Akın", "Deniz Öztürk", "Caner Güneş", "Selin Arslan", "Burak Efe",
            "Gizem Kara", "Ozan Yıldız", "Büşra Çetin", "Ahmet Korkmaz", "Ece Aydın",
            "Murat Şahin", "Pınar Keskin", "Yusuf Kılıç", "Esra Doğan", "Kerem Acar",
            "Nazlı Tekin", "Furkan Toprak", "Seda Turan", "Cem Erdem", "Elif Koç",
            "Barış Deniz", "Ceren Koçak", "Kaan Şahin", "Melek Özcan", "Savaş Kaya",
            "Melike Gür", "Eren Yılmaz", "İrem Ersoy", "Umut Çınar"
        ];
        if (students.includes(name)) {
            localStorage.setItem('userRole', 'student');
            localStorage.setItem('studentName', name);
            window.location.href = "main.html";
        } else {
            alert("Öğrenci listesinde adın bulunamadı.");
        }
    });

    // Öğretmen Girişi
    teacherBtn.addEventListener('click', () => {
        teacherLoginForm.style.display = 'block';
        studentLoginForm.style.display = 'none';
        teacherBtn.classList.add('active');
        studentBtn.classList.remove('active');
    });

    teacherLoginBtn.addEventListener('click', () => {
        const password = teacherPasswordInput.value;
        const TEACHER_PASSWORD = "1234";
        if (password === TEACHER_PASSWORD) {
            localStorage.setItem('userRole', 'teacher');
            window.location.href = "main.html";
        } else {
            alert("Yanlış şifre.");
        }
    });
}


// Ana panel mantığı (main.html)
if (document.querySelector('.main-container')) {
    const userRole = localStorage.getItem('userRole');
    const studentName = localStorage.getItem('studentName');
    let studentData = {};
    let isInitialLoad = true;

    const students = [
        "Ali Yılmaz", "Ayşe Can", "Mehmet Demir", "Fatma Kaya", "Emre Çelik",
        "Zeynep Akın", "Deniz Öztürk", "Caner Güneş", "Selin Arslan", "Burak Efe",
        "Gizem Kara", "Ozan Yıldız", "Büşra Çetin", "Ahmet Korkmaz", "Ece Aydın",
        "Murat Şahin", "Pınar Keskin", "Yusuf Kılıç", "Esra Doğan", "Kerem Acar",
        "Nazlı Tekin", "Furkan Toprak", "Seda Turan", "Cem Erdem", "Elif Koç",
        "Barış Deniz", "Ceren Koçak", "Kaan Şahin", "Melek Özcan", "Savaş Kaya",
        "Melike Gür", "Eren Yılmaz", "İrem Ersoy", "Umut Çınar"
    ];

    const dateElement = document.querySelector('.current-date');
    const userRoleText = document.getElementById('user-role-text');
    const teacherPanel = document.getElementById('teacher-panel');
    const studentPanel = document.getElementById('student-panel');
    const studentPanelName = document.getElementById('student-panel-name');
    const studentPanelContent = document.getElementById('student-panel-content');
    const studentListContainer = document.getElementById('student-list');
    const saveBtn = document.querySelector('.save-btn');
    const modal = document.getElementById('details-modal');
    const modalCloseBtn = document.querySelector('.close-btn');
    const modalStudentName = document.getElementById('modal-student-name');
    const modalDetailsContent = document.getElementById('modal-details-content');

    // Tarihi göster
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = today.toLocaleDateString('tr-TR', options);

    // Firebase'den veri dinlemeye başla
    onValue(studentsRef, (snapshot) => {
        studentData = snapshot.val() || {};
        if (userRole === 'teacher') {
            renderTeacherPanel();
        } else if (userRole === 'student') {
            renderStudentPanel(studentName);
        }
    });

    if (userRole === 'teacher') {
        userRoleText.textContent = "Öğretmen Paneli";
        teacherPanel.style.display = 'block';
        studentPanel.style.display = 'none';

    } else if (userRole === 'student') {
        userRoleText.textContent = "Öğrenci Paneli";
        teacherPanel.style.display = 'none';
        studentPanel.style.display = 'block';
    } else {
        window.location.href = "index.html";
    }

    function renderTeacherPanel() {
        studentListContainer.innerHTML = '';
        students.forEach((student, index) => {
            if (!studentData[student]) {
                studentData[student] = { attendance: [], homework: [] };
            }

            const studentCard = document.createElement('div');
            studentCard.className = 'student-card';
            studentCard.dataset.name = student;

            const studentNameElem = document.createElement('h4');
            studentNameElem.textContent = `${index + 1}. ${student}`;
            studentCard.appendChild(studentNameElem);

            const detailsIcon = document.createElement('button');
            detailsIcon.className = 'details-icon';
            detailsIcon.innerHTML = '<i class="fas fa-info-circle"></i>';
            detailsIcon.addEventListener('click', () => {
                showDetailsModal(student);
            });
            studentCard.appendChild(detailsIcon);

            const controlsSection = document.createElement('div');
            controlsSection.className = 'controls-buttons';

            const attendanceBtn = document.createElement('button');
            attendanceBtn.className = 'btn attendance-btn';

            const homeworkBtn = document.createElement('button');
            homeworkBtn.className = 'btn homework-btn';

            attendanceBtn.addEventListener('click', (e) => {
                e.target.classList.toggle('absent');
                e.target.classList.toggle('present');
                e.target.textContent = e.target.classList.contains('present') ? 'Var' : 'Yok';
                updateSaveButtonState();
            });

            homeworkBtn.addEventListener('click', (e) => {
                e.target.classList.toggle('not-done');
                e.target.classList.toggle('done');
                e.target.textContent = e.target.classList.contains('done') ? 'Ödev Yaptı' : 'Ödev Yapmadı';
                updateSaveButtonState();
            });

            controlsSection.appendChild(attendanceBtn);
            controlsSection.appendChild(homeworkBtn);

            studentCard.appendChild(controlsSection);
            studentListContainer.appendChild(studentCard);
        });

        loadLastState();
        updateSaveButtonState();
    }

    function renderStudentPanel(name) {
        studentPanelName.textContent = name;
        const student = studentData[name];
        studentPanelContent.innerHTML = '';

        if (student) {
            const attendanceList = document.createElement('ul');
            const attendanceDates = student.attendance;
            if (attendanceDates && attendanceDates.length > 0) {
                const attendanceTitle = document.createElement('h4');
                attendanceTitle.textContent = `Devamsızlık Günlerin:`;
                attendanceList.appendChild(attendanceTitle);

                attendanceDates.forEach(date => {
                    const li = document.createElement('li');
                    li.textContent = date;
                    attendanceList.appendChild(li);
                });
                studentPanelContent.appendChild(attendanceList);
            }

            const homeworkList = document.createElement('ul');
            const homeworkDates = student.homework;
            if (homeworkDates && homeworkDates.length > 0) {
                 const homeworkTitle = document.createElement('h4');
                homeworkTitle.textContent = `Ödev Yapmadığın Günler:`;
                homeworkList.appendChild(homeworkTitle);

                homeworkDates.forEach(date => {
                    const li = document.createElement('li');
                    li.textContent = date;
                    homeworkList.appendChild(li);
                });
                studentPanelContent.appendChild(homeworkList);
            }

            if ((!student.attendance || student.attendance.length === 0) && (!student.homework || student.homework.length === 0)) {
                studentPanelContent.innerHTML = '<p>Kayıtlı bir devamsızlık veya ödev bilgisi bulunamadı.</p>';
            }
        }
    }

    async function saveCurrentState() {
        const studentCards = document.querySelectorAll('.student-card');
        const todayString = new Date().toLocaleDateString('tr-TR');

        studentCards.forEach(card => {
            const studentName = card.dataset.name;
            const attendanceBtn = card.querySelector('.attendance-btn');
            const homeworkBtn = card.querySelector('.homework-btn');

            const isAbsent = attendanceBtn.classList.contains('absent');
            const isNotDone = homeworkBtn.classList.contains('not-done');

            const attendanceIndex = (studentData[studentName]?.attendance || []).indexOf(todayString);
            if (isAbsent && attendanceIndex === -1) {
                studentData[studentName].attendance = studentData[studentName].attendance || [];
                studentData[studentName].attendance.push(todayString);
            } else if (!isAbsent && attendanceIndex !== -1) {
                studentData[studentName].attendance.splice(attendanceIndex, 1);
            }

            const homeworkIndex = (studentData[studentName]?.homework || []).indexOf(todayString);
            if (isNotDone && homeworkIndex === -1) {
                studentData[studentName].homework = studentData[studentName].homework || [];
                studentData[studentName].homework.push(todayString);
            } else if (!isNotDone && homeworkIndex !== -1) {
                studentData[studentName].homework.splice(homeworkIndex, 1);
            }
        });

        await set(studentsRef, studentData);
    }

    function loadLastState() {
        const todayString = new Date().toLocaleDateString('tr-TR');
        const studentCards = document.querySelectorAll('.student-card');

        studentCards.forEach(card => {
            const studentName = card.dataset.name;
            const attendanceBtn = card.querySelector('.attendance-btn');
            const homeworkBtn = card.querySelector('.homework-btn');

            if (studentData[studentName] && studentData[studentName].attendance?.includes(todayString)) {
                attendanceBtn.classList.remove('present');
                attendanceBtn.classList.add('absent');
                attendanceBtn.textContent = 'Yok';
            } else {
                attendanceBtn.classList.remove('absent');
                attendanceBtn.classList.add('present');
                attendanceBtn.textContent = 'Var';
            }

            if (studentData[studentName] && studentData[studentName].homework?.includes(todayString)) {
                homeworkBtn.classList.remove('done');
                homeworkBtn.classList.add('not-done');
                homeworkBtn.textContent = 'Ödev Yapmadı';
            } else {
                homeworkBtn.classList.remove('not-done');
                homeworkBtn.classList.add('done');
                homeworkBtn.textContent = 'Ödev Yaptı';
            }
        });
    }

    function updateSaveButtonState() {
        const studentCards = document.querySelectorAll('.student-card');
        let hasChanges = false;
        const todayString = new Date().toLocaleDateString('tr-TR');

        studentCards.forEach(card => {
            const studentName = card.dataset.name;
            const attendanceBtn = card.querySelector('.attendance-btn');
            const homeworkBtn = card.querySelector('.homework-btn');

            const isAbsent = attendanceBtn.classList.contains('absent');
            const isNotDone = homeworkBtn.classList.contains('not-done');

            if (studentData[studentName] &&
                ((studentData[studentName].attendance?.includes(todayString) || false) !== isAbsent ||
                (studentData[studentName].homework?.includes(todayString) || false) !== isNotDone)) {
                hasChanges = true;
            }
        });

        if (hasChanges) {
            saveBtn.classList.add('active');
            saveBtn.disabled = false;
        } else {
            saveBtn.classList.remove('active');
            saveBtn.disabled = true;
        }
    }

    function showDetailsModal(studentName) {
        modalStudentName.textContent = studentName;
        modalDetailsContent.innerHTML = '';

        const student = studentData[studentName];
        if (student) {
            const attendanceList = document.createElement('ul');
            const attendanceDates = student.attendance;
            if (attendanceDates && attendanceDates.length > 0) {
                const attendanceTitle = document.createElement('h5');
                attendanceTitle.textContent = `Devamsızlık Günleri: (${attendanceDates.length} gün)`;
                attendanceList.appendChild(attendanceTitle);

                attendanceDates.forEach(date => {
                    const li = document.createElement('li');
                    li.textContent = date;
                    attendanceList.appendChild(li);
                });
                modalDetailsContent.appendChild(attendanceList);
            }

            const homeworkList = document.createElement('ul');
            const homeworkDates = student.homework;
            if (homeworkDates && homeworkDates.length > 0) {
                 const homeworkTitle = document.createElement('h5');
                homeworkTitle.textContent = `Ödev Yapmadığı Günler: (${homeworkDates.length} defa)`;
                homeworkList.appendChild(homeworkTitle);

                homeworkDates.forEach(date => {
                    const li = document.createElement('li');
                    li.textContent = date;
                    homeworkList.appendChild(li);
                });
                modalDetailsContent.appendChild(homeworkList);
            }

            if ((!student.attendance || student.attendance.length === 0) && (!student.homework || student.homework.length === 0)) {
                modalDetailsContent.innerHTML = '<p>Bu öğrenci için geçmiş kayıt bulunamadı.</p>';
            }
        }
        modal.style.display = "block";
    }

    modalCloseBtn.addEventListener('click', () => {
        modal.style.display = "none";
    });

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    });

    saveBtn.addEventListener('click', async () => {
        await saveCurrentState();
        alert('Tüm veriler başarıyla kaydedildi!');
        updateSaveButtonState();
    });
}
