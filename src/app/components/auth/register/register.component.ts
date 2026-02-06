import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { LayoutService } from '../../../layout/service/app.layout.service';
import { Branch, Instance, User, License } from '../../../models';
import { AuthService } from '../../../services';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UsersInterface } from '../../../interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    user: User = new User();
    branch: Branch = new Branch();
    isBusy: Boolean = false;
    isAuthorized: Boolean | null = null;
    licenses: License[] = [];
    selectedLicenseId: number = 0;
    branchesArray: Branch[] = [];

    constructor(
        private uS: AuthService,
        private usersService: UsersInterface,
        private messageService: MessageService,
        public layoutService: LayoutService,
        private router: Router,
        private http: HttpClient,
        private fb: FormBuilder
    ) {
        localStorage.removeItem('user');
        this.registerForm = this.createForm();
    }

    ngOnInit() {
        this.isBusy = false;
        this.user.instance = new Instance();
        this.user.instance.branches = [];
        this.getLicenses();
    }

    createForm(): FormGroup {
        return this.fb.group({
            // Paso 1: Plan
            selectedLicenseId: [0, [Validators.required, Validators.min(1)]],
            
            // Paso 2: Datos Personales
            name: ['', [Validators.required, Validators.minLength(3)]],
            phone_number: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{4}-\d{4}$/)]],
            email: ['', [Validators.required, Validators.email]],
            
            // Paso 3: Datos del Negocio
            name_client: ['', [Validators.required, Validators.minLength(3)]],
            name_kitchen: ['', [Validators.required, Validators.minLength(3), this.noSpacesValidator]],
            
            // Paso 4: Credenciales
            user_name: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    // Validadores personalizados
    noSpacesValidator(control: AbstractControl): ValidationErrors | null {
        if (control.value && /\s/.test(control.value)) {
            return { hasSpaces: true };
        }
        return null;
    }

    passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;
        
        const hasUpperCase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        
        if (!hasUpperCase || !hasNumber) {
            return { weakPassword: true };
        }
        return null;
    }

    passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        
        if (password && confirmPassword && password !== confirmPassword) {
            return { passwordMismatch: true };
        }
        return null;
    }

    getLicenses() {
        this.http.get<License[]>(`${environment.apiBase}Licenses`).subscribe({
            next: (data) => {
                // Filter out internal "Cortesia" plan (ID 1)
                const publicLicenses = data.filter(l => l.id !== 1);

                // Sort: Price 0 (Free Trial) first, then by Price ascending
                this.licenses = publicLicenses.sort((a, b) => {
                    if (a.price === 0) return -1;
                    if (b.price === 0) return 1;
                    return (a.price || 0) - (b.price || 0);
                });

                // Auto-select the first plan (Free Trial) and set form control
                if (this.licenses.length > 0) {
                    const firstId = this.licenses[0].id || 0;
                    this.selectedLicenseId = firstId;
                    this.registerForm.get('selectedLicenseId')?.setValue(firstId);
                }
            },
            error: (e) => console.error(e)
        });
    }

    toLowerCase() {
        const nameKitchen = this.registerForm.get('name_kitchen')?.value;
        if (nameKitchen) {
            const cleaned = nameKitchen.toLowerCase().replace(/\s+/g, '');
            this.registerForm.get('name_kitchen')?.setValue(cleaned, { emitEvent: false });
        }
    }


    addBranche() {
        if (!this.branch.name || this.branch.name.trim() === '') {
            this.messageService.add({ 
                severity: 'warn', 
                summary: 'Advertencia', 
                detail: 'El nombre de la sucursal no puede estar vacío' 
            });
            return;
        }

        const isDuplicate = this.branchesArray.some(
            b => b.name?.toLowerCase() === this.branch.name?.toLowerCase()
        );

        if (isDuplicate) {
            this.messageService.add({ 
                severity: 'warn', 
                summary: 'Advertencia', 
                detail: 'Ya existe una sucursal con ese nombre' 
            });
            return;
        }

        this.branchesArray.push({ ...this.branch });
        this.branch = new Branch();
    }


    deleteBranche(index: number) {
        this.branchesArray.splice(index, 1);
    }


    validateStep1(): boolean {
        return this.registerForm.get('selectedLicenseId')?.valid || false;
    }

    validateStep2(): boolean {
        const nameValid = this.registerForm.get('name')?.valid;
        const phoneValid = this.registerForm.get('phone_number')?.valid;
        const emailValid = this.registerForm.get('email')?.valid;
        return !!(nameValid && phoneValid && emailValid);
    }

    validateStep3(): boolean {
        const clientNameValid = this.registerForm.get('name_client')?.valid;
        const kitchenNameValid = this.registerForm.get('name_kitchen')?.valid;
        const hasBranches = this.branchesArray.length > 0;
        return !!(clientNameValid && kitchenNameValid && hasBranches);
    }

    validateStep4(): boolean {
        const userNameValid = this.registerForm.get('user_name')?.valid;
        const passwordValid = this.registerForm.get('password')?.valid;
        const confirmPasswordValid = this.registerForm.get('confirmPassword')?.valid;
        const passwordsMatch = !this.registerForm.errors?.['passwordMismatch'];
        return !!(userNameValid && passwordValid && confirmPasswordValid && passwordsMatch);
    }

    validateForm(): boolean {
        if (!this.validateStep1()) {
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Debes seleccionar un plan' 
            });
            return false;
        }
        if (!this.validateStep2()) {
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Completa todos los datos personales correctamente' 
            });
            return false;
        }
        if (!this.validateStep3()) {
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Completa los datos del negocio y agrega al menos una sucursal' 
            });
            return false;
        }
        if (!this.validateStep4()) {
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Usuario, contraseña y confirmación son requeridos' 
            });
            return false;
        }
        return true;
    }

    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Helpers para obtener errores de controles individuales
    getFieldError(fieldName: string): string | null {
        const control = this.registerForm.get(fieldName);
        if (!control || !control.errors || !control.touched) {
            return null;
        }

        if (control.errors['required']) {
            return 'Este campo es requerido';
        }
        if (control.errors['minlength']) {
            const requiredLength = control.errors['minlength'].requiredLength;
            return `Mínimo ${requiredLength} caracteres`;
        }
        if (control.errors['email']) {
            return 'Email inválido';
        }
        if (control.errors['pattern']) {
            return 'Formato inválido';
        }
        if (control.errors['min']) {
            return 'Selecciona una opción válida';
        }
        if (control.errors['hasSpaces']) {
            return 'No debe contener espacios';
        }
        if (control.errors['weakPassword']) {
            return 'Debe contener al menos una mayúscula y un número';
        }

        return null;
    }

    register() {
        if (!this.validateForm()) {
            return;
        }

        this.isBusy = true;
        
        // Extraer valores del formulario
        const formValues = this.registerForm.value;
        
        // Poblar el modelo User con los valores del formulario
        this.user.name = formValues.name;
        this.user.phone_number = formValues.phone_number;
        this.user.email = formValues.email;
        this.user.user_name = formValues.user_name;
        this.user.password = formValues.password;
        
        // Poblar Instance
        if (!this.user.instance) {
            this.user.instance = new Instance();
        }
        this.user.instance.name_client = formValues.name_client;
        this.user.instance.name_kitchen = formValues.name_kitchen;
        this.user.instance.licenseId = formValues.selectedLicenseId;
        this.user.instance.branches = [...this.branchesArray];
        this.user.instance.correo = formValues.email;

        this.uS.register(Object.assign({}, this.user)).subscribe({
            next: (resp) => {
                this.isBusy = false;
                this.isAuthorized = true;
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Éxito', 
                    detail: 'Registro completado exitosamente. Redirigiendo...' 
                });
                setTimeout(() => {
                    this.router.navigate(['/kitchen/tables']);
                }, 1500);
            },
            error: (e) => {
                this.isBusy = false;
                this.isAuthorized = false;
                
                let errorMsg = 'Error al registrar. Intenta nuevamente.';
                
                // Check for error message from GlobalExceptionFilter
                if (e.error?.error) {
                    errorMsg = e.error.error;
                } 
                // Legacy format
                else if (e.error?.messages) {
                    errorMsg = e.error.messages;
                } 
                // Fallback based on status code
                else if (e.status === 400) {
                    errorMsg = 'Datos inválidos. Verifica la información ingresada.';
                } else if (e.status === 403) {
                    errorMsg = 'El correo ya está registrado.';
                } else if (e.status === 500) {
                    errorMsg = 'Error del servidor. Intenta más tarde.';
                }
                
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: errorMsg 
                });
            }
        });
    }

}
