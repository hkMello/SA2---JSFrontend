(function () {
  'use strict';

  const MENSAGENS = {
    required: 'Este campo é obrigatório.',
    'positive-number': 'Informe um número maior que zero.',
    number: 'Informe um número válido (não negativo).',
  };

  function limparErro(input) {
    input.classList.remove('campo-invalido');
    const erroExistente = input.parentElement.querySelector('.mensagem-erro');
    if (erroExistente) {
      erroExistente.remove();
    }
  }

  function mostrarErro(input, mensagem) {
    limparErro(input);
    input.classList.add('campo-invalido');

    const span = document.createElement('span');
    span.className = 'mensagem-erro';
    span.textContent = mensagem;
    span.style.color = '#d92d20';
    span.style.fontSize = '0.85rem';
    span.style.display = 'block';
    span.style.marginTop = '4px';

    input.parentElement.appendChild(span);
  }

  function validarCampo(input) {
    const tipo = input.getAttribute('data-validate');
    const valor = input.value.trim();

    if (tipo === 'required') {
      if (valor === '') {
        mostrarErro(input, MENSAGENS.required);
        return false;
      }
    }

    if (tipo === 'number' || tipo === 'positive-number') {
      if (valor === '') {
        mostrarErro(input, MENSAGENS.required);
        return false;
      }
      const numero = Number(valor);
      if (Number.isNaN(numero)) {
        mostrarErro(input, MENSAGENS.number);
        return false;
      }
      if (tipo === 'number' && numero < 0) {
        mostrarErro(input, MENSAGENS.number);
        return false;
      }
      if (tipo === 'positive-number' && numero <= 0) {
        mostrarErro(input, MENSAGENS['positive-number']);
        return false;
      }
    }

    limparErro(input);
    return true;
  }

  function validarFormulario(form) {
    const campos = form.querySelectorAll('[data-validate]');
    let formValido = true;

    campos.forEach((campo) => {
      const campoValido = validarCampo(campo);
      if (!campoValido) {
        formValido = false;
      }
    });

    return formValido;
  }

  function inicializar() {
    const formularios = document.querySelectorAll('[data-validated-form]');

    formularios.forEach((form) => {
      // Validação em tempo real ao sair do campo (blur)
      const campos = form.querySelectorAll('[data-validate]');
      campos.forEach((campo) => {
        campo.addEventListener('blur', () => validarCampo(campo));
        campo.addEventListener('input', () => {
          // limpa o erro assim que o usuário começa a corrigir
          if (campo.classList.contains('campo-invalido')) {
            limparErro(campo);
          }
        });
      });

      // Validação no submit
      form.addEventListener('submit', (evento) => {
        const valido = validarFormulario(form);
        if (!valido) {
          evento.preventDefault();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', inicializar);
})();
