document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formLogin');
    const inputLogin = document.getElementById('inputLogin');
    const inputSenha = document.getElementById('inputSenha');

    // --- FUNÇÃO DE HASH SHA-256 (ASSÍNCRONA) ---
    /**
     * Gera um hash SHA-256 de uma string.
     * É fundamental para comparar a senha e o CPF digitados com os hashes salvos.
     * @param {string} string A string a ser hasheada.
     * @returns {Promise<string>} O hash em formato hexadecimal.
     */
    async function hashSHA256(string) {
        if (!string) return '';
        // 1. Converte a string em ArrayBuffer
        const msgUint8 = new TextEncoder().encode(string);
        // 2. Cria o hash
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        // 3. Converte o buffer para string hexadecimal
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    // ----------------------------------------------------

    // ATENÇÃO: O listener do evento 'submit' deve ser 'async'
    form.addEventListener('submit', async (event) => { 
        event.preventDefault(); 

        const login = inputLogin.value.trim();
        const senha = inputSenha.value;
        const tipoUsuarioSelecionado = document.querySelector('input[name="tipoUsuario"]:checked').value; 

        // 1. HASH DO CPF/LOGIN E DA SENHA DIGITADOS
        // Devemos hashear os inputs para comparar com os hashes salvos.
        const loginHasheado = await hashSHA256(login);
        const senhaHasheada = await hashSHA256(senha);

        // 2. Obter a lista de usuários
        const chaveLocalStorage = (tipoUsuarioSelecionado === 'professor') ? 'professores' : 'alunos';
        const listaUsuarios = JSON.parse(localStorage.getItem(chaveLocalStorage)) || [];
        
        let usuarioEncontrado = null;

        // 3. Buscar o usuário na lista usando o HASH do LOGIN (CPF)
        const tipoBusca = tipoUsuarioSelecionado === 'professor' ? 'professor' : 'aluno';
        
        usuarioEncontrado = listaUsuarios.find(usuario => 
            // A busca AGORA compara o hash do input (loginHasheado) com o hash salvo (usuario.cpfHash)
            usuario.cpfHash === loginHasheado && usuario.tipo === tipoBusca
        );

        // 4. Verificar se o usuário foi encontrado e se a senha está correta
        if (usuarioEncontrado) {
            // A verificação AGORA compara o hash da senha digitada (senhaHasheada) com o hash da senha salva (usuarioEncontrado.senhaHash)
            if (usuarioEncontrado.senhaHash === senhaHasheada) {
                
                alert(`Login bem-sucedido! Bem-vindo(a), ${usuarioEncontrado.nome}.`);
                
                sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));

                // 5. Redirecionar para a tela inicial correta
                if (usuarioEncontrado.tipo === 'professor') {
                    window.location.href = 'telaInicialProfessor.html';
                } else if (usuarioEncontrado.tipo === 'aluno') {
                    window.location.href = 'telaInicialAluno.html';
                }

            } else {
                alert('Senha incorreta. Tente novamente.');
                inputSenha.focus();
            }
        } else {
            // Se o loginHasheado não encontrou ninguém no cpfHash
            alert('Usuário não encontrado ou o login (CPF/Matrícula) está incorreto para o tipo de conta selecionado.');
            inputLogin.focus();
        }
    });
});