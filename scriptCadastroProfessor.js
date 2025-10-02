document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCadastro');
    const inputNome = document.getElementById('inputNome');
    const inputCpf = document.getElementById('inputCpf');
    const inputSenha = document.getElementById('inputSenha');

    // --- FUNÇÃO DE HASH SHA-256 (ASSÍNCRONA) ---
    /**
     * Gera um hash SHA-256 de uma string.
     * @param {string} string A string a ser hasheada.
     * @returns {Promise<string>} O hash em formato hexadecimal.
     */
    async function hashSHA256(string) {
        if (!string) return '';
        const msgUint8 = new TextEncoder().encode(string); // encode como UTF-8
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    // ----------------------------------------------------

    // --- Funções de Validação (Mantidas) ---
    function validarNome(nome) {
        const regexNome = /^[a-zA-ZáàâãéèêíïóôõöúüçÁÀÂÃÉÈÊÍÏÓÔÕÖÚÜÇ\s]+$/;
        return regexNome.test(nome);
    }

    function validarSenha(senha) {
        if (senha.length < 8) return false;
        const regexEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        return regexEspecial.test(senha);
    }
    // --------------------------------------------------------------------------

    // ATENÇÃO: O listener do evento 'submit' deve ser 'async' para usar 'await'
    form.addEventListener('submit', async (event) => { 
        event.preventDefault();

        const nome = inputNome.value.trim();
        const cpf = inputCpf.value.trim();
        const senha = inputSenha.value; // Senha sem .trim() antes do hash
        const tipo = "professor";

        // 1. Validação de Campos Vazios
        if (nome === '' || cpf === '' || senha === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // 2. Execução das Validações
        if (!validarNome(nome)) {
            alert('Erro no Nome: O nome deve conter apenas letras e espaços.');
            inputNome.focus();
            return;
        }

        if (!validarSenha(senha)) {
            alert('Erro na Senha: A senha deve ter no mínimo 8 caracteres e conter pelo menos um caractere especial.');
            inputSenha.focus();
            return;
        }
        
        // --- NOVO: GERAÇÃO DO HASH (utilizando await) ---
        const cpfHasheado = await hashSHA256(cpf);
        const senhaHasheada = await hashSHA256(senha);
        // --------------------------------------------------


        // 3. RECUPERA a lista usando a chave 'professores'
        const listaProfessores = JSON.parse(localStorage.getItem('professores')) || [];

        // 4. Verifica se o CPF já existe (comparando os HASHES)
        const cpfExistente = listaProfessores.some(professor => professor.cpfHash === cpfHasheado);
        if (cpfExistente) {
            alert('Erro: Já existe um professor cadastrado com este CPF.');
            inputCpf.focus();
            return;
        }

        // 5. Cria o objeto do novo professor, salvando apenas os hashes
        const novoProfessor = {
            nome: nome,
            cpfHash: cpfHasheado,   // O CPF original NÃO é salvo
            senhaHash: senhaHasheada, // A Senha original NÃO é salva
            tipo: tipo
        };

        // 6. Adiciona o novo professor à lista
        listaProfessores.push(novoProfessor);

        // 7. SALVA a lista atualizada
        try {
            localStorage.setItem('professores', JSON.stringify(listaProfessores)); 
            
            alert('Cadastro de Professor realizado com sucesso! Você será redirecionado para a tela de Login.');
            
            window.location.href = 'login.html';
            
        } catch (e) {
            alert('Erro ao salvar os dados. Verifique o espaço de armazenamento.');
            console.error(e);
        }
    });
});