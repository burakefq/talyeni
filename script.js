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
    measurementId: "G-2LXL8T8P3LE",
    databaseURL: "https://torbali-anadolu-lisesi-869d8-default-rtdb.europe-west1.firebasedatabase.app"
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
    const studentSuggestionsList = document.getElementById('student-suggestions');

    // Bu liste, verdiğiniz numaralara göre sıralanmış öğrencileri içerir
    const students_10E = [
        { number: 553, name: "Ceylin Serbest" },
        { number: 574, name: "Fulya Su Şentürk" },
        { number: 772, name: "İlkbal Şahin" },
        { number: 773, name: "Melisa Duru Şahin" },
        { number: 774, name: "Dijle Genç" },
        { number: 775, name: "Hasan Can Hür" },
        { number: 776, name: "Barkın Özden" },
        { number: 777, name: "Emir Elagöz" },
        { number: 778, name: "Melike Kılıçarslan" },
        { number: 780, name: "Alperen Hakkı Güler" },
        { number: 781, name: "Ayşe Su Taş" },
        { number: 782, name: "Esmanur Bilici" },
        { number: 783, name: "Yunus Emre Yılmaz" },
        { number: 785, name: "Duru Ceylin Sarıtekeli" },
        { number: 786, name: "Berfin Çek" },
        { number: 787, name: "Nazlıcan Kaya" },
        { number: 788, name: "Sümeyra Karacadağ" },
        { number: 789, name: "Ahmet Eren Gümüş" },
        { number: 790, name: "Elbihan Yoluk" },
        { number: 791, name: "Egehan Zerman" },
        { number: 792, name: "Sümeyye Parmaksız" },
        { number: 793, name: "Asmen Ali Topal" },
        { number: 794, name: "Halil İbrahim Durmaz" },
        { number: 795, name: "Eren Tolunay" },
        { number: 796, name: "Rugeyye Su Çankaya" },
        { number: 797, name: "Mert Şen" },
        { number: 798, name: "Beytullah Kollik" },
        { number: 800, name: "Ekrem Kaan Fidan" },
        { number: 802, name: "Burak Efe" },
        { number: 804, name: "Tuyun Seven Özçelik" },
        { number: 805, name: "Ege Tufan Karaahmetoğlu" },
        { number: 806, name: "Elif Şahin" },
        { number: 888, name: "Duru Şahin" },
        { number: 889, name: "Çağan" },
        { number: 897, name: "Toprak Kubat" }
    ];

    // Öğrenci Girişi
    studentBtn.addEventListener('click', () => {
        studentLoginForm.style.display = 'block';
        teacherLoginForm.style.display = 'none';
        studentBtn.classList.add('active');
        teacherBtn.classList.remove('active');
        studentSuggestionsList.style.display = 'none'; // Başlangıçta öneri listesini gizle
        studentNameInput.value = ''; // Giriş alanını temizle
    });

    studentLoginBtn.addEventListener('click', () => {
        const name = studentNameInput.value.trim();
        const studentExists = students_10E.some(student => student.name === name);
        if (studentExists) {
            localStorage.setItem('userRole', 'student');
            localStorage.setItem('studentName', name);
            window.location.href = "main.html";
        } else {
            alert("Öğrenci listesinde adın bulunamadı.");
        }
    });

    // Kullanıcı yazarken isim önerilerini filtrele
    studentNameInput.addEventListener('input', () => {
        const inputText = studentNameInput.value.toLowerCase();

        if (inputText.length === 0) {
            studentSuggestionsList.style.display = 'none';
            return;
        }

        const filteredStudents = students_10E.filter(student =>
            student.name.toLowerCase().includes(inputText)
        ).map(student => student.name);
        updateSuggestions(filteredStudents);
    });

    // Öneri listesini güncelleyen fonksiyon
    function updateSuggestions(list) {
        studentSuggestionsList.innerHTML = '';
        list.forEach(studentName => {
            const li = document.createElement('li');
            li.textContent = studentName;
            li.addEventListener('click', () => {
                studentNameInput.value = studentName;
                studentSuggestionsList.innerHTML = '';
                studentSuggestionsList.style.display = 'none';
            });
            studentSuggestionsList.appendChild(li);
        });
        studentSuggestionsList.style.display = list.length > 0 ? 'block' : 'none';
    }

    // Öğretmen Girişi
    teacherBtn.addEventListener('click', () => {
        studentSuggestionsList.style.display = 'none'; // Öğretmen girişine geçince önerileri gizle
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

    // Bu liste de güncellendi
    const students = [
        { number: 553, name: "Ceylin Serbest" },
        { number: 574, name: "Fulya Su Şentürk" },
        { number: 772, name: "İlkbal Şahin" },
        { number: 773, name: "Melisa Duru Şahin" },
        { number: 774, name: "Dijle Genç" },
        { number: 775, name: "Hasan Can Hür" },
        { number: 776, name: "Barkın Özden" },
        { number: 777, name: "Emir Elagöz" },
        { number: 778, name: "Melike Kılıçarslan" },
        { number: 780, name: "Alperen Hakkı Güler" },
        { number: 781, name: "Ayşe Su Taş" },
        { number: 782, name: "Esmanur Bilici" },
        { number: 783, name: "Yunus Emre Yılmaz" },
        { number: 785, name: "Duru Ceylin Sarıtekeli" },
        { number: 786, name: "Berfin Çek" },
        { number: 787, name: "Nazlıcan Kaya" },
        { number: 788, name: "Sümeyra Karacadağ" },
        { number: 789, name: "Ahmet Eren Gümüş" },
        { number: 790, name: "Elbihan Yoluk" },
        { number: 791, name: "Egehan Zerman" },
        { number: 792, name: "Sümeyye Parmaksız" },
        { number: 793, name: "Asmen Ali Topal" },
        { number: 794, name: "Halil İbrahim Durmaz" },
        { number: 795, name: "Eren Tolunay" },
        { number: 796, name: "Rugeyye Su Çankaya" },
        { number: 797, name: "Mert Şen" },
        { number: 798, name: "Beytullah Kollik" },
        { number: 800, name: "Ekrem Kaan Fidan" },
        { number: 802, name: "Burak Efe" },
        { number: 804, name: "Tuyun Seven Özçelik" },
        { number: 805, name: "Ege Tufan Karaahmetoğlu" },
        { number: 806, name: "Elif Şahin" },
        { number: 888, name: "Duru Şahin" },
        { number: 889, name: "Çağan" },
        { number: 897, name: "Toprak Kubat" }
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

    // Firebase'den veri dinlemeye başla ve ilk veriyi çek
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
        students.forEach((studentObj) => {
            const studentName = studentObj.name;
            const studentNumber = studentObj.number;

            if (!studentData[studentName]) {
                studentData[studentName] = { attendance: [], homework: [] };
            }

            const studentCard = document.createElement('div');
            studentCard.className = 'student-card';
            studentCard.dataset.name = studentName;

            const studentNameElem = document.createElement('h4');
            // Okul numarasını da ekledik
            studentNameElem.textContent = `${studentNumber}. ${studentName}`;
            studentCard.appendChild(studentNameElem);

            const detailsIcon = document.createElement('button');
            detailsIcon.className = 'details-icon';
            detailsIcon.innerHTML = '<i class="fas fa-info-circle"></i>';
            detailsIcon.addEventListener('click', () => {
                showDetailsModal(studentName);
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
        const updatedData = { ...studentData };

        studentCards.forEach(card => {
            const studentName = card.dataset.name;
            const attendanceBtn = card.querySelector('.attendance-btn');
            const homeworkBtn = card.querySelector('.homework-btn');

            const isAbsent = attendanceBtn.classList.contains('absent');
            const isNotDone = homeworkBtn.classList.contains('not-done');

            updatedData[studentName] = updatedData[studentName] || { attendance: [], homework: [] };
            const attendanceArray = updatedData[studentName].attendance || [];
            const homeworkArray = updatedData[studentName].homework || [];

            const attendanceIndex = attendanceArray.indexOf(todayString);
            if (isAbsent && attendanceIndex === -1) {
                attendanceArray.push(todayString);
            } else if (!isAbsent && attendanceIndex !== -1) {
                attendanceArray.splice(attendanceIndex, 1);
            }

            const homeworkIndex = homeworkArray.indexOf(todayString);
            if (isNotDone && homeworkIndex === -1) {
                homeworkArray.push(todayString);
            } else if (!isNotDone && homeworkIndex !== -1) {
                homeworkArray.splice(homeworkIndex, 1);
            }

            updatedData[studentName].attendance = attendanceArray;
            updatedData[studentName].homework = homeworkArray;
        });

        await set(studentsRef, updatedData);
    }

    function loadLastState() {
        const todayString = new Date().toLocaleDateString('tr-TR');
        const studentCards = document.querySelectorAll('.student-card');

        studentCards.forEach(card => {
            const studentName = card.dataset.name;
            const attendanceBtn = card.querySelector('.attendance-btn');
            const homeworkBtn = card.querySelector('.homework-btn');

            const attendanceArray = studentData[studentName]?.attendance || [];
            const homeworkArray = studentData[studentName]?.homework || [];

            if (attendanceArray.includes(todayString)) {
                attendanceBtn.classList.remove('present');
                attendanceBtn.classList.add('absent');
                attendanceBtn.textContent = 'Yok';
            } else {
                attendanceBtn.classList.remove('absent');
                attendanceBtn.classList.add('present');
                attendanceBtn.textContent = 'Var';
            }

            if (homeworkArray.includes(todayString)) {
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

            const attendanceInDB = studentData[studentName]?.attendance?.includes(todayString) || false;
            const homeworkInDB = studentData[studentName]?.homework?.includes(todayString) || false;

            if (attendanceInDB !== isAbsent || homeworkInDB !== isNotDone) {
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
