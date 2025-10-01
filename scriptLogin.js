document.addEventListener('DOMContentLoaded', () => {
    // Pega o formulário de Login pelo ID
    const formLogin = document.getElementById('formLogin');

    if (!formLogin) {
        console.error("Erro: O formulário de login não foi encontrado!");
        return;
    }

    formLogin.addEventListener('submit', (evento) => {
        evento.preventDefault();

        // 1. Pega os valores dos campos
        const login = document.getElementById('inputLogin').value.trim();
        const senha = document.getElementById('inputSenha').value;

        // Pega o tipo de usuário selecionado (professor ou aluno)
        const tipoUsuarioSelecionado = document.querySelector('input[name="tipoUsuario"]:checked').value;

        // 2. Validação básica
        if (login === "" || senha === "") {
            alert("Por favor, preencha o Login e a Senha.");
            return;
        }

        // 3. Verifica o Login
        if (tipoUsuarioSelecionado === 'professor') {
            logarProfessor(login, senha);
        } else if (tipoUsuarioSelecionado === 'aluno') {
            logarAluno(login, senha); // <--- Chamada para a nova função
        }
    });

    // Função específica para logar Professor
    function logarProfessor(login, senha) {
        const professoresJSON = localStorage.getItem('professores');
        let professores = professoresJSON ? JSON.parse(professoresJSON) : [];

        const professorEncontrado = professores.find(prof => 
            prof.login === login && prof.senha === senha
        );

        if (professorEncontrado) {
            const dadosSessao = {
                login: professorEncontrado.login,
                nome: professorEncontrado.nome,
                tipo: 'professor',
            };
            
            localStorage.setItem('usuarioLogado', JSON.stringify(dadosSessao));
            alert(`Login de Professor bem-sucedido! Bem-vindo(a), ${professorEncontrado.nome}.`);
            window.location.href = 'telaInicialProfessor.html'; 

        } else {
            alert("Login ou Senha de Professor inválidos.");
        }
    }

    // Função específica para logar Aluno (NOVA)
    function logarAluno(login, senha) {
        // A chave 'alunosCadastrados' é onde salvamos os dados
        const alunosJSON = localStorage.getItem('alunosCadastrados');
        let alunos = alunosJSON ? JSON.parse(alunosJSON) : [];

        // Busca o aluno que corresponde ao login (CPF) e Senha
        const alunoEncontrado = alunos.find(aluno =>
            // O login do aluno é o CPF que ele usou no cadastro
            aluno.cpf === login && aluno.senha === senha 
        );

        if (alunoEncontrado) {
            const dadosSessao = {
                login: alunoEncontrado.cpf,
                nome: alunoEncontrado.nome,
                tipo: 'aluno',
            };

            localStorage.setItem('usuarioLogado', JSON.stringify(dadosSessao));
            alert(`Login de Aluno bem-sucedido! Bem-vindo(a), ${alunoEncontrado.nome}.`);
            window.location.href = 'telaInicialAluno.html'; // Redireciona para a página do aluno

        } else {
            alert("Login (CPF) ou Senha de Aluno inválidos.");
        }
    }
});