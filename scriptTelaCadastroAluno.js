document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCadastroAluno');
    const inputNome = document.getElementById('inputNomeAluno');
    const inputCpf = document.getElementById('inputCpfAluno');
    const inputSenha = document.getElementById('inputSenhaAluno');

    // Funções de ajuda
    function getAlunos() {
        return JSON.parse(localStorage.getItem('alunos')) || [];
    }

    function saveAlunos(alunos) {
        localStorage.setItem('alunos', JSON.stringify(alunos));
    }

    // Função de Validação de Senha (reutilizada do professor)
    function validarSenha(senha) {
        if (senha.length < 8) return false;
        // Pelo menos um caractere especial (se a regra for a mesma do professor)
        const regexEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/; 
        return regexEspecial.test(senha);
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nome = inputNome.value.trim();
        const cpf = inputCpf.value.trim();
        const senha = inputSenha.value;

        // Validação da senha
        if (!validarSenha(senha)) {
            alert('A senha deve ter no mínimo 8 caracteres e conter pelo menos um caractere especial.');
            inputSenha.focus();
            return;
        }

        let alunos = getAlunos();
        
        // 1. Tentar encontrar o aluno pelo NOME E CPF
        const alunoIndex = alunos.findIndex(aluno => 
            aluno.nome.toLowerCase() === nome.toLowerCase() && 
            aluno.cpf === cpf
        );

        if (alunoIndex === -1) {
            alert('Nome ou CPF não encontrados. Verifique se os dados estão corretos conforme cadastrado pelo professor.');
            return;
        }

        const aluno = alunos[alunoIndex];

        // 2. Verificar se o aluno já tem senha (Bloquear redefinição)
        if (aluno.senha) {
            alert('Você já definiu sua senha. Por favor, utilize a tela de Login.');
            // Opcional: Redirecionar para o login
            window.location.href = 'login.html';
            return;
        }

        // 3. Ativação: Adiciona a senha ao registro do aluno
        aluno.senha = senha;
        alunos[alunoIndex] = aluno; // Atualiza o objeto no array
        
        // 4. Salva no LocalStorage
        saveAlunos(alunos);

        alert(`Parabéns, ${aluno.nome}! Sua senha foi definida com sucesso. Você pode fazer login agora.`);
        
        // Redireciona para a tela de login
        window.location.href = 'login.html';
    });
});