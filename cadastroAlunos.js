const LS_KEY_ALUNOS = 'alunosCadastrados';

function getAlunos() {
    const alunosData = localStorage.getItem(LS_KEY_ALUNOS);
    return alunosData ? JSON.parse(alunosData) : [];
}

function saveAlunos(alunos) {
    localStorage.setItem(LS_KEY_ALUNOS, JSON.stringify(alunos));
}

function cadastrarAluno(login, senha) {
    const alunos = getAlunos();
    
    // Verifica se já existe um aluno com o mesmo login (CPF/Matrícula)
    const alunoExistente = alunos.find(aluno => aluno.login === login);

    if (alunoExistente) {
        return { success: false, message: 'Já existe um aluno cadastrado com este Login.' };
    }

    const novoAluno = {
        login: login,
        senha: senha
    };

    alunos.push(novoAluno);
    saveAlunos(alunos);
    
    return { success: true, message: 'Cadastro de aluno realizado com sucesso!' };
}

function logarAluno(login, senha) {
    const alunos = getAlunos();
    const alunoEncontrado = alunos.find(aluno => 
        aluno.login === login && aluno.senha === senha
    );

    if (alunoEncontrado) {
        return { success: true, message: 'Login de aluno efetuado com sucesso!' };
    } else {
        return { success: false, message: 'Login ou Senha de aluno incorretos ou Aluno não cadastrado.' };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    const inputLogin = document.getElementById('inputLogin');
    const inputSenha = document.getElementById('inputSenha');
    const radioAluno = document.getElementById('aluno');
    const btnLogar = document.getElementById('btnLogar');

    const btnCadastroAluno = document.createElement('button');
    btnCadastroAluno.type = 'button';
    btnCadastroAluno.id = 'btnCadastrarAluno';
    btnCadastroAluno.textContent = 'Cadastrar Aluno';
    btnCadastroAluno.style.display = 'none';

    const linkCadastroProfessor = document.querySelector('a[href="cadastro.html"]');
    if (linkCadastroProfessor) {
        formLogin.insertBefore(btnCadastroAluno, linkCadastroProfessor.previousElementSibling.previousElementSibling);
    } else {
        formLogin.insertBefore(btnCadastroAluno, btnLogar.nextElementSibling);
    }

    function toggleCadastroAlunoButton() {
        if (radioAluno.checked) {
            btnCadastroAluno.style.display = 'block';
            btnLogar.textContent = 'Logar Aluno';
        } else {
            btnCadastroAluno.style.display = 'none';
            btnLogar.textContent = 'Logar';
        }
    }

    toggleCadastroAlunoButton();
    radioAluno.addEventListener('change', toggleCadastroAlunoButton);
    document.getElementById('professor').addEventListener('change', toggleCadastroAlunoButton);
    btnCadastroAluno.addEventListener('click', (event) => {
        if (!radioAluno.checked) return;

        event.preventDefault();

        const login = inputLogin.value.trim();
        const senha = inputSenha.value;

        if (login && senha) {
            const resultado = cadastrarAluno(login, senha);
            alert(resultado.message);
        
            if (resultado.success) {
                inputLogin.value = '';
                inputSenha.value = '';
            }
        } else {
            alert('Por favor, preencha o Login e a Senha para o cadastro.');
        }
    });

    formLogin.addEventListener('submit', (event) => {
        event.preventDefault();

        const login = inputLogin.value.trim();
        const senha = inputSenha.value;
        const tipoUsuario = document.querySelector('input[name="tipoUsuario"]:checked').value;

        if (!login || !senha) {
            alert('Por favor, preencha o Login e a Senha.');
            return;
        }

        if (tipoUsuario === 'aluno') {
            // Tenta logar o aluno
            const resultado = logarAluno(login, senha);
            alert(resultado.message);

            if (resultado.success) {
                // Redirecionar para a página do aluno, por exemplo:
                // window.location.href = 'aluno/dashboard.html'; 
                console.log('Aluno logado com sucesso!');
            }
        } else if (tipoUsuario === 'professor') {
            alert('Funcionalidade de Login de Professor aqui...');
        }
    });
});