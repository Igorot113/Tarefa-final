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
            logarAluno(login,senha);
        }
    });

    // Função específica para logar Professor
    function logarProfessor(login, senha) {
        // A chave 'professores' é onde salvamos os dados no cadastro
        const professoresJSON = localStorage.getItem('professores');
        let professores = professoresJSON ? JSON.parse(professoresJSON) : [];

        // 4. Busca o professor que corresponde ao login (CPF) e Senha
        const professorEncontrado = professores.find(prof => 
            prof.login === login && prof.senha === senha
        );

        if (professorEncontrado) {
            // 5. LOGIN BEM-SUCEDIDO! Salva o estado de logado
            const dadosSessao = {
                login: professorEncontrado.login,
                nome: professorEncontrado.nome,
                tipo: 'professor',
                // NUNCA SALVE A SENHA AQUI, APENAS INFORMAÇÕES BÁSICAS DA SESSÃO
            };
            
            // Salva no localStorage que o professor está logado
            localStorage.setItem('usuarioLogado', JSON.stringify(dadosSessao));

            alert(`Login de Professor bem-sucedido! Bem-vindo(a), ${professorEncontrado.nome}.`);
            
            // Redireciona para a página do professor (Ex: painel.html)
            window.location.href = 'telaInicialProfessor.html'; 

        } else {
            // 6. Login FALHOU
            alert("Login ou Senha de Professor inválidos.");
        }
    }

    function logarAluno(login, senha) {
        // A chave 'professores' é onde salvamos os dados no cadastro
        const alunosJSON = localStorage.getItem('alunos');
        let alunos = professoresJSON ? JSON.parse(alunosJSON) : [];

        // 4. Busca o professor que corresponde ao login (CPF) e Senha
        const alunosEncontrado = alunos.find(aluno => 
            aluno.login === login && aluno.senha === senha
        );

        if (alunosEncontrado) {
            // 5. LOGIN BEM-SUCEDIDO! Salva o estado de logado
            const dadosSessao = {
                login: alunosEncontrado.login,
                nome: alunosEncontrado.nome,
                tipo: 'alunos',
                // NUNCA SALVE A SENHA AQUI, APENAS INFORMAÇÕES BÁSICAS DA SESSÃO
            };
            
            // Salva no localStorage que o professor está logado
            localStorage.setItem('usuarioLogado', JSON.stringify(dadosSessao));

            alert(`Login de Aluno bem-sucedido! Bem-vindo(a), ${alunosEncontrado.nome}.`);
            
            // Redireciona para a página do professor (Ex: painel.html)
            window.location.href = 'telaInicialAluno.html'; 

        } else {
            // 6. Login FALHOU
            alert("Login ou Senha de Professor inválidos.");
        }
    }
});