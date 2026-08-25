import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar-component/navbar-component';

@Component({
  selector: 'app-navbar-component',
  template: '',
})
class MockNavbarComponent {}

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let app: App;
  let nativeDom: HTMLElement;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    TestBed.overrideComponent(App, {
      remove: { imports: [RouterOutlet, NavbarComponent] },
      add: { imports: [RouterOutlet, MockNavbarComponent] },
    });
    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
    nativeDom = fixture.nativeElement as HTMLElement;
  });
  it('should create', () => {
    expect(app).toBeTruthy();
  });
  it('should render app-navbar-component', () => {
    expect(nativeDom.querySelector('app-navbar-component')).not.toBeNull();
  });
  it('should render router-outlet', () => {
    expect(nativeDom.querySelector('router-outlet')).not.toBeNull();
  });
  it('should render navbar on to of RouterOutlet', () => {
    const navbar: HTMLElement = nativeDom.querySelector('app-navbar-component')!;
    const routerOutlet: HTMLElement = nativeDom.querySelector('router-outlet')!;
    const compareResult = navbar.compareDocumentPosition(routerOutlet);
    console.log(routerOutlet.compareDocumentPosition(navbar));
    expect(compareResult & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
