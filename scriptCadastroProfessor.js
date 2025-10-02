document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCadastro');
    const inputNome = document.getElementById('inputNome');
    const inputCpf = document.getElementById('inputCpf');
    const inputSenha = document.getElementById('inputSenha');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nome = inputNome.value.trim();
        const cpf = inputCpf.value.trim();
        const senha = inputSenha.value;
        const tipo = "professor";

        // --- Funções de Validação (Corretas) ---
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

        // --- Execução das Validações (Corretas) ---
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
        // --------------------------------------------------------


        // 1. RECUPERA a lista usando a chave 'professores'
        const listaProfessores = JSON.parse(localStorage.getItem('professores')) || [];

        // 2. Verifica se o CPF já existe
        const cpfExistente = listaProfessores.some(professor => professor.cpf === cpf);
        if (cpfExistente) {
            alert('Erro: Já existe um professor cadastrado com este CPF.');
            inputCpf.focus();
            return;
        }

        const novoProfessor = {
            nome: nome,
            cpf: cpf,
            senha: senha,
            tipo: tipo
        };

        // 3. Adiciona o novo professor à lista
        listaProfessores.push(novoProfessor);

        // 4. SALVA a lista atualizada de volta na chave 'professores'
        try {
            // ESTA LINHA CRIA/ATUALIZA A CHAVE 'professores'
            localStorage.setItem('professores', JSON.stringify(listaProfessores)); 
            
            alert('Cadastro de Professor realizado com sucesso! Você será redirecionado para a tela de Login.');
            
            window.location.href = 'login.html';
            
        } catch (e) {
            alert('Erro ao salvar os dados. Verifique o espaço de armazenamento.');
            console.error(e);
        }
    });
});