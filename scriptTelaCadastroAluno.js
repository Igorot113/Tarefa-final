document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCadastroAluno');
    const inputNome = document.getElementById('inputNomeAluno');
    const inputCpf = document.getElementById('inputCpfAluno');
    const inputSenha = document.getElementById('inputSenhaAluno');

    // --- FUNÇÃO DE HASH SHA-256 (ASSÍNCRONA) ---
    /**
     * Gera um hash SHA-256 de uma string.
     * @param {string} string A string a ser hasheada.
     * @returns {Promise<string>} O hash em formato hexadecimal.
     */
    async function hashSHA256(string) {
        if (!string) return '';
        const msgUint8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    // ----------------------------------------------------

    // Funções de ajuda
    function getAlunos() {
        return JSON.parse(localStorage.getItem('alunos')) || [];
    }

    function saveAlunos(alunos) {
        localStorage.setItem('alunos', JSON.stringify(alunos));
    }

    // Função de Validação de Senha
    function validarSenha(senha) {
        if (senha.length < 8) return false;
        const regexEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/; 
        return regexEspecial.test(senha);
    }

    // ATENÇÃO: O listener é 'async'
    form.addEventListener('submit', async (event) => { 
        event.preventDefault();

        const nome = inputNome.value.trim();
        const cpf = inputCpf.value.trim();
        const senha = inputSenha.value;

        // Validação da senha (síncrona)
        if (!validarSenha(senha)) {
            alert('A senha deve ter no mínimo 8 caracteres e conter pelo menos um caractere especial.');
            inputSenha.focus();
            return;
        }

        // --- HASH DOS INPUTS ---
        // 1. Hashea a senha para salvar
        const senhaHasheada = await hashSHA256(senha);
        
        // 2. Hashea o CPF APENAS para buscar (comparar com o que está salvo)
        const cpfHasheadoParaBusca = await hashSHA256(cpf);
        // -----------------------

        let alunos = getAlunos();
        
        // 1. Tentar encontrar o aluno pelo NOME E CPF HASHEADO
        // O Nome é comparado em texto puro (case-insensitive)
        // O CPF é comparado no formato HASH (cpfHasheadoParaBusca) com o campo cpfHash salvo
        const alunoIndex = alunos.findIndex(aluno => 
            aluno.nome.toLowerCase() === nome.toLowerCase() && 
            aluno.cpfHash === cpfHasheadoParaBusca // CORREÇÃO: Busca pelo CPF hasheado
        );


        if (alunoIndex === -1) {
            alert('Nome ou CPF não encontrados. Verifique se os dados estão corretos conforme cadastrado pelo professor.');
            return;
        }

        const aluno = alunos[alunoIndex];

        // 2. Verificar se o aluno já tem senha (Bloquear redefinição)
        if (aluno.senhaHash) { 
            alert('Você já definiu sua senha. Por favor, utilize a tela de Login.');
            window.location.href = 'login.html';
            return;
        }

        // 3. Ativação: Adiciona o HASH da senha ao registro do aluno
        aluno.senhaHash = senhaHasheada; // Salva o HASH da senha
        delete aluno.senha; // Garante que o campo de senha em texto puro não exista
        alunos[alunoIndex] = aluno;
        
        // 4. Salva no LocalStorage
        saveAlunos(alunos);

        alert(`Parabéns, ${aluno.nome}! Sua senha foi definida com sucesso. Você pode fazer login agora.`);
        
        // Redireciona para a tela de login
        window.location.href = 'login.html';
    });
});