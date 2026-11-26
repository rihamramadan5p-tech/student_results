class Student {
    #name;
    #grades;
    #attendance;
    constructor(name, grades, attendance) {
        this.#name = name;
        this.grades = grades;
        this.attendance = attendance;
    }
    get name() {
        return this.#name;
    }
    set grades(val) {
        for (let i = 0; i < val.length; i++) {
            if (val[i] === "") {
                throw new Error("من فضلك أدخل جميع الدرجات");
            }
            let num = Number(val[i]);
            if (isNaN(num) || num < 0 || num > 100) {
                throw new Error("الدرجة يجب أن تكون بين 0 و 100");
            }
        }
        this.#grades = val.map(Number);
    }
    get grades() {
        return this.#grades;
    }
    set attendance(val) {
        if (val === "") {
            throw new Error("من فضلك أدخل نسبة الحضور");
        }
        let num = Number(val);
        if (isNaN(num) || num < 0 || num > 100) {
            throw new Error("نسبة الحضور يجب أن تكون بين 0 و 100");
        }
        this.#attendance = num;
    }
    get attendance() {
        return this.#attendance;
    }
    getAverage() {
        let sum = 0;
        for (let i = 0; i < this.#grades.length; i++) {
            sum += this.#grades[i];
        }
        return sum / this.#grades.length;
    }
}
let studentsList = [];
let nameInput = document.getElementById("studentname");
let g1Input = document.getElementById("grade1");
let g2Input = document.getElementById("grade2");
let g3Input = document.getElementById("grade3");
let attInput = document.getElementById("attendance");
let addbtn = document.getElementById("addbtn");
let mercybtn = document.getElementById("mercybtn");
let errorbox = document.getElementById("errorbox");
let studentsBox = document.getElementById("studentsbox");
let reportbox = document.getElementById("reportbox");
addbtn.onclick = function () {
    errorbox.innerHTML= "";
    try {
        let name = nameInput.value.trim();
        if (name === "") {
            throw new Error("من فضلك أدخل اسم الطالب");
        }
        let grades = [g1Input.value, g2Input.value, g3Input.value];
        let attendance = attInput.value;
        let student = new Student(name, grades, attendance);
        studentsList.push(student);
        studentsBox.innerHTML += `<div class="student-item">${student.name} - المتوسط: ${student.getAverage().toFixed(1)}</div>`;
        nameInput.value = "";
        g1Input.value = "";
        g2Input.value = "";
        g3Input.value = "";
        attInput.value = "";
    } catch (error) {
        errorbox.innerHTML= error.message;
    }
};
mercybtn.onclick = function () {
    let weakStudents = studentsList.filter(function (st) {
        let avg = st.getAverage();
        return avg >= 40 && avg <= 49;
    });
    let updatedStudents = weakStudents.map(function (st) {
        let newAvg = st.getAverage() + 5;
        return {
            name: st.name,
            newAverage: newAvg
        };
    });
    let totalNewAvg = updatedStudents.reduce(function (acc, item) {
        return acc + item.newAverage;
    }, 0);
    let generalAverage = 0;
    if (updatedStudents.length > 0) {
        generalAverage = totalNewAvg / updatedStudents.length;
    }
    if (updatedStudents.length === 0) {
        reportbox.innerHTML= `<p>لا يوجد طلاب متعثرون في نطاق لجنة الرأفة (40 - 49).</p>`;
    } else {
        let names = updatedStudents.map(function (item) {
            return `<li>${item.name} (المتوسط بعد الرأفة: ${item.newAverage.toFixed(1)})</li>`;
        }).join("");
        reportbox.innerHTML= `
            <p>عدد الطلاب المتعثرين: ${updatedStudents.length}</p>
            <p>أسماء الطلاب:</p>
            <ul>${names}</ul>
            <p>المتوسط العام بعد الرأفة: ${generalAverage.toFixed(2)}</p>
        `;
    }
};