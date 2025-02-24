import * as React from 'react';
import { mount as mountBase } from '@cypress/react';

import { FluentProvider } from '@fluentui/react-provider';
import { teamsLightTheme } from '@fluentui/react-theme';
import { Toaster, ToastTitle, Toast, useToastController, toastClassNames, ToastTrigger } from '../..';

const mount = (element: JSX.Element) => {
  mountBase(<FluentProvider theme={teamsLightTheme}>{element}</FluentProvider>);
};

describe('Toast', () => {
  it('should dispatch toast', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const onClick = () => {
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
        );
      };

      return (
        <>
          <button onClick={onClick}>Make toast</button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('button').click().get(`.${toastClassNames.root}`).should('exist');
  });

  it('should dismiss toast', () => {
    const Example = () => {
      const toastId = 'foo';
      const { dispatchToast, dismissToast } = useToastController();
      const makeToast = () => {
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { toastId, timeout: -1 },
        );
      };

      const removeToast = () => {
        dismissToast(toastId);
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <button id="dismiss" onClick={removeToast}>
            Dismiss toast
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make')
      .click()
      .get(`.${toastClassNames.root}`)
      .should('exist')
      .get('#dismiss')
      .click()
      .get(`.${toastClassNames.root}`)
      .should('not.exist');
  });

  it('should dismiss all toasts', () => {
    const Example = () => {
      const { dispatchToast, dismissAllToasts } = useToastController();
      const makeToast = () => {
        for (let i = 0; i < 5; i++) {
          dispatchToast(
            <Toast>
              <ToastTitle>This is a toast</ToastTitle>
            </Toast>,
            { timeout: -1 },
          );
        }
      };

      const removeToast = () => {
        dismissAllToasts();
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <button id="dismiss" onClick={removeToast}>
            Dismiss toast
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make')
      .click()
      .get(`.${toastClassNames.root}`)
      .should('have.length', 5)
      .get('#dismiss')
      .click()
      .get(`.${toastClassNames.root}`)
      .should('not.exist');
  });

  it('should play and pause toast', () => {
    const Example = () => {
      const toastId = 'foo';
      const { dispatchToast, playToast, pauseToast } = useToastController();
      const makeToast = () => {
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { toastId, timeout: 200 },
        );
      };

      const pause = () => {
        pauseToast(toastId);
      };

      const play = () => {
        playToast(toastId);
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <button id="pause" onClick={pause}>
            Pause toast
          </button>
          <button id="play" onClick={play}>
            Play toast
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make')
      .click()
      .get(`.${toastClassNames.root}`)
      .should('exist')
      .get('#pause')
      .click()
      .wait(1000)
      .get(`.${toastClassNames.root}`)
      .should('exist')
      .get('#play')
      .click()
      .get(`.${toastClassNames.root}`)
      .should('not.exist');
  });

  it('should be update toast', () => {
    const Example = () => {
      const toastId = 'foo';
      const { dispatchToast, updateToast } = useToastController();
      const makeToast = () => {
        for (let i = 0; i < 5; i++) {
          dispatchToast(
            <Toast>
              <ToastTitle>This is a toast</ToastTitle>
            </Toast>,
            { timeout: -1, toastId },
          );
        }
      };

      const update = () => {
        updateToast({
          content: (
            <Toast>
              <ToastTitle>Foo</ToastTitle>
            </Toast>
          ),
          toastId,
        });
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <button id="update" onClick={update}>
            Update toast
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make')
      .click()
      .get(`.${toastClassNames.root}`)
      .should('exist')
      .get('#update')
      .click()
      .get('body')
      .contains('Foo');
  });

  it('should be pause on hover', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () => {
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: 500, pauseOnHover: true },
        );
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make')
      .click()
      .get(`.${toastClassNames.root}`)
      .trigger('mouseenter')
      .wait(700)
      .get(`.${toastClassNames.root}`)
      .should('exist');
  });

  it('should be pause all toasts on focus', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () => {
        for (let i = 0; i < 4; i++) {
          dispatchToast(
            <Toast>
              <ToastTitle>This is a toast</ToastTitle>
            </Toast>,
            { timeout: 500, pauseOnHover: true },
          );
        }

        dispatchToast(
          <Toast>
            <ToastTitle action={<button id="action">action</button>}>This is a toast</ToastTitle>
          </Toast>,
          { timeout: 500, pauseOnHover: true },
        );
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make').click().get(`#action`).focus().wait(700).get(`.${toastClassNames.root}`).should('have.length', 5);
  });

  it('should follow lifecycle', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const [log, setLog] = React.useState<string[]>([]);
      const makeToast = () => {
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: 500, onStatusChange: (_, data) => setLog(s => [...s, data.status]) },
        );
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <ul>
            {log.map(msg => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
          <Toaster />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make')
      .click()
      .get('li')
      .should('have.length', 4)
      .get('li')
      .eq(0)
      .should('have.text', 'queued')
      .get('li')
      .eq(1)
      .should('have.text', 'visible')
      .get('li')
      .eq(2)
      .should('have.text', 'dismissed')
      .get('li')
      .eq(3)
      .should('have.text', 'unmounted');
  });

  it('should focus most recent toast with shortcut', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () => {
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: 500 },
        );
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: 500, root: { id: 'most-recent' } },
        );
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <Toaster shortcuts={{ focus: e => e.ctrlKey && e.key === 'm' }} />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make')
      .click()
      .get('#most-recent')
      .should('exist')
      .get('body')
      .type('{ctrl+m}')
      .get('#most-recent')
      .should('be.focused');
  });

  it('should pause all toasts when one is focused', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () => {
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: 200 },
        );
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: 200, root: { id: 'most-recent' } },
        );
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <Toaster shortcuts={{ focus: e => e.ctrlKey && e.key === 'm' }} />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make')
      .click()
      .get('#most-recent')
      .should('exist')
      .get('body')
      .type('{ctrl+m}')
      .get('#most-recent')
      .should('be.focused')
      .wait(500)
      .get(`.${toastClassNames.root}`)
      .should('have.length', 2);
  });

  it('should dismiss toast with escape and revert focus', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () => {
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: 200 },
        );
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <Toaster shortcuts={{ focus: e => e.ctrlKey && e.key === 'm' }} />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make')
      .click()
      .get(`.${toastClassNames.root}`)
      .should('exist')
      .get('body')
      .type('{ctrl+m}')
      .focused()
      .type('{esc}')
      .get(`.${toastClassNames.root}`)
      .should('not.exist')
      .get('#make')
      .should('be.focused');
  });

  it('should dismiss toast and revert focus with escape', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () => {
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: 200 },
        );
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <Toaster shortcuts={{ focus: e => e.ctrlKey && e.key === 'm' }} />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make')
      .click()
      .get(`.${toastClassNames.root}`)
      .should('exist')
      .get('body')
      .type('{ctrl+m}')
      .focused()
      .type('{esc}')
      .get(`.${toastClassNames.root}`)
      .should('not.exist')
      .get('#make')
      .should('be.focused');
  });

  it('should revert focus and resume toasts on tab out', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () => {
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: 200, root: { id: 'toast' } },
        );
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <button>Foo</button>
          <button>Foo</button>
          <button>Foo</button>
          <button>Foo</button>
          <Toaster shortcuts={{ focus: e => e.ctrlKey && e.key === 'm' }} />
        </>
      );
    };

    mount(<Example />);
    cy.get('#make')
      .click()
      .get('#toast')
      .should('exist')
      .get('body')
      .type('{ctrl+m}')
      .get('#toast')
      .should('be.focused')
      .realPress(['Shift', 'Tab']);

    cy.get('#make').should('be.focused').get('#toast').should('not.exist');
  });

  it('should resume toasts after dismissing with action', () => {
    const Example = () => {
      const { dispatchToast } = useToastController();
      const makeToast = () => {
        dispatchToast(
          <Toast>
            <ToastTitle
              action={
                <ToastTrigger>
                  <button id="dismiss">dismiss</button>
                </ToastTrigger>
              }
            >
              This is a toast
            </ToastTitle>
          </Toast>,
          { timeout: 200, root: { id: 'toast' } },
        );
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: 200 },
        );
        dispatchToast(
          <Toast>
            <ToastTitle>This is a toast</ToastTitle>
          </Toast>,
          { timeout: 200 },
        );
      };

      return (
        <>
          <button id="make" onClick={makeToast}>
            Make toast
          </button>
          <Toaster />
        </>
      );
    };

    mount(<Example />);

    cy.get('#make')
      .click()
      .get('#dismiss')
      .focus()
      .click()
      .get(`.${toastClassNames.root}`)
      .should('have.length', 2)
      .get(`.${toastClassNames.root}`)
      .should('not.exist');
  });
});
