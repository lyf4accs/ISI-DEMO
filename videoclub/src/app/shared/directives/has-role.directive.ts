import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private userRole = 'admin'; // luego lo conectas a AuthService

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appHasRole(role: string) {
    this.viewContainer.clear();
    if (this.userRole === role) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
