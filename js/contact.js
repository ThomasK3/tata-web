// Třída pro zpracování kontaktního formuláře
class ContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.feedbackDiv = document.createElement('div');
        this.feedbackDiv.className = 'form-feedback';
        this.form.insertBefore(this.feedbackDiv, this.submitBtn);
        
        // Přidání event listenerů
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.form.addEventListener('input', this.handleInput.bind(this));
        
        // Inicializace validačních pravidel
        this.validationRules = {
            name: {
                required: true,
                minLength: 3,
                pattern: /^[a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s]+$/
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            phone: {
                required: false,
                pattern: /^(\+420)?\s*[0-9]{3}\s*[0-9]{3}\s*[0-9]{3}$/
            },
            message: {
                required: true,
                minLength: 10
            }
        };
    }

    // Validace jednotlivých polí
    validateField(field) {
        const name = field.name;
        const value = field.value.trim();
        const rules = this.validationRules[name];
        
        if (!rules) return true;

        // Kontrola required
        if (rules.required && !value) {
            return 'Toto pole je povinné';
        }

        // Kontrola minLength
        if (rules.minLength && value.length < rules.minLength) {
            return `Minimální délka je ${rules.minLength} znaků`;
        }

        // Kontrola pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            switch(name) {
                case 'name':
                    return 'Prosím zadejte platné jméno';
                case 'email':
                    return 'Prosím zadejte platnou e-mailovou adresu';
                case 'phone':
                    return 'Prosím zadejte platné telefonní číslo (9 číslic)';
                default:
                    return 'Neplatný formát';
            }
        }

        return true;
    }

    // Obsluha změn v inputech
    handleInput(e) {
        const field = e.target;
        this.updateFieldValidation(field);
    }

    // Aktualizace validace pole
    updateFieldValidation(field) {
        const errorSpan = field.parentElement.querySelector('.error-message');
        const validationResult = this.validateField(field);

        if (errorSpan) {
            field.parentElement.removeChild(errorSpan);
        }

        if (validationResult !== true) {
            const span = document.createElement('span');
            span.className = 'error-message';
            span.textContent = validationResult;
            field.parentElement.appendChild(span);
            field.classList.add('invalid');
            field.classList.remove('valid');
        } else {
            field.classList.add('valid');
            field.classList.remove('invalid');
        }
    }

    // Zobrazení zpětné vazby
    showFeedback(message, isError = false) {
        this.feedbackDiv.textContent = message;
        this.feedbackDiv.className = `form-feedback ${isError ? 'error' : 'success'}`;
        this.feedbackDiv.style.display = 'block';

        if (!isError) {
            setTimeout(() => {
                this.feedbackDiv.style.display = 'none';
                this.form.reset();
                this.form.querySelectorAll('.valid').forEach(field => {
                    field.classList.remove('valid');
                });
            }, 5000);
        }
    }

    // Odeslání formuláře
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validace všech polí
        const fields = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        fields.forEach(field => {
            this.updateFieldValidation(field);
            if (field.classList.contains('invalid')) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showFeedback('Prosím opravte chyby ve formuláři', true);
            return;
        }

        // Deaktivace tlačítka během odesílání
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Odesílám...';

        // Simulace odeslání na server
        try {
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());
            
            // Zde by byl skutečný API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Úspěšné odeslání
            this.showFeedback('Děkujeme za vaši zprávu. Budeme vás kontaktovat co nejdříve.');
            
        } catch (error) {
            this.showFeedback('Omlouváme se, při odesílání došlo k chybě. Zkuste to prosím později.', true);
        } finally {
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = 'Odeslat zprávu';
        }
    }
}

// Inicializace formuláře po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm('contact-form');
});