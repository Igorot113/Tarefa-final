document.addEventListener('DOMContentLoaded', () => {
    const btnCadastro = document.getElementById('btnCadastroAluno');
    const inputNome = document.getElementById('nome');
    const inputCpf = document.getElementById('cpf');

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

    function validarNome(nome) {
        const regex = /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/;
        return regex.test(nome);
    }

    // ATENÇÃO: O listener AGORA é 'async'
    btnCadastro.addEventListener('click', async () => { 
        const nome = inputNome.value.trim();
        const cpf = inputCpf.value.trim();

        // 1. Validação Simples (campos vazios)
        if (nome === '' || cpf === '') {
            alert('Por favor, preencha o Nome e o CPF do aluno.');
            return;
        }

        // 1.1. Validação de Caracteres Especiais no Nome
        if (!validarNome(nome)) {
            alert('Erro: O nome não pode conter caracteres especiais ou números. Por favor, utilize apenas letras e espaços.');
            inputNome.focus();
            return;
        }

        // --- NOVO: GERAÇÃO DO HASH DO CPF ---
        const cpfHasheado = await hashSHA256(cpf);
        // ------------------------------------

        let alunos = getAlunos();

        // 2. Verifica duplicidade de CPF (AGORA usando o HASH)
        // O campo no objeto salvo deve ser 'cpfHash'
        const cpfExistente = alunos.some(aluno => aluno.cpfHash === cpfHasheado); 
        if (cpfExistente) {
            alert('Erro: Já existe um aluno cadastrado com este CPF.');
            inputCpf.focus();
            return;
        }
        
        // 3. Cria o objeto do novo aluno
        const novoAluno = {
            nome: nome,
            cpfHash: cpfHasheado, // Salva o CPF HASHEADO, não o valor original
            tipo: 'aluno', 
            statusAprovacao: 'Pendente',
            aulasAtribuidas: {},
            tarefasPendentes: []
        };

        // 4. Salva no LocalStorage
        alunos.push(novoAluno);
        saveAlunos(alunos);

        alert(`Aluno ${nome} cadastrado com sucesso!`);
        
        // Opcional: Limpar formulário
        inputNome.value = '';
        inputCpf.value = '';
    });
});