document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formLogin');
    const inputLogin = document.getElementById('inputLogin');
    const inputSenha = document.getElementById('inputSenha');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        const login = inputLogin.value.trim();
        const senha = inputSenha.value;
        // Pega o valor do botão de rádio selecionado ('aluno' ou 'professor')
        const tipoUsuarioSelecionado = document.querySelector('input[name="tipoUsuario"]:checked').value; 

        // 1. Determinar qual chave do localStorage usar
        // Por enquanto, só temos 'professores' no localStorage.
        // Se você já tiver implementado o cadastro de alunos com a chave 'alunos', descomente a linha.
        const chaveLocalStorage = (tipoUsuarioSelecionado === 'professor') ? 'professores' : 'alunos';

        // 2. Obter a lista de usuários da chave correta
        // Se for 'alunos' e a chave não existir, a lista será vazia.
        const listaUsuarios = JSON.parse(localStorage.getItem(chaveLocalStorage)) || [];
        
        let usuarioEncontrado = null;

        // 3. Buscar o usuário na lista pelo CPF (para professor)
        if (tipoUsuarioSelecionado === 'professor') {
            usuarioEncontrado = listaUsuarios.find(usuario => 
                usuario.cpf === login && usuario.tipo === 'professor'
            );
        } else {
            // Lógica para Aluno:
            // Supondo que o aluno use o CPF ou Matrícula para login. 
            // Como ainda não temos o campo "matrícula" no localstorage para alunos, 
            // faremos a busca APENAS pelo login (que será o CPF, por enquanto).
            usuarioEncontrado = listaUsuarios.find(usuario => 
                (usuario.cpf === login /* || usuario.matricula === login */) && usuario.tipo === 'aluno'
            );
        }

        // 4. Verificar se o usuário foi encontrado e se a senha está correta
        if (usuarioEncontrado) {
            // Em um sistema real, aqui você usaria um algoritmo de HASH para verificar a senha.
            if (usuarioEncontrado.senha === senha) {
                
                alert(`Login bem-sucedido! Bem-vindo(a), ${usuarioEncontrado.nome}.`);
                
                // Opcional: Salvar o usuário logado para manter a sessão
                sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));

                // 5. Redirecionar para a tela inicial correta
                if (usuarioEncontrado.tipo === 'professor') {
                    // Mudar para o caminho real da tela do professor
                    // window.location.href = 'telaProfessor.html';
                    window.location.href = 'telaInicialProfessor.html';
                } else if (usuarioEncontrado.tipo === 'aluno') {
                    // Mudar para o caminho real da tela do aluno
                    // window.location.href = 'telaAluno.html';
                    window.location.href = 'telaInicialAluno.html';
                    console.log("LOGADO: Redirecionando para tela do Aluno...");
                }

            } else {
                alert('Senha incorreta. Tente novamente.');
                inputSenha.focus();
            }
        } else {
            alert('Usuário não encontrado ou o login (CPF/Matrícula) está incorreto para o tipo de conta selecionado.');
            inputLogin.focus();
        }
    });
});