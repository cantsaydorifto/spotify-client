import tippy, { hideAll } from 'tippy.js';
import type { Props, Plugin, LifecycleHooks, Instance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

interface CustomProps {
  hideOnPopperBlur: boolean;
  hideOnEsc: boolean;
  hideOthersOnOpen: boolean;
}

type FilteredProps = CustomProps & Omit<Props, keyof CustomProps | keyof LifecycleHooks>;

type ExtendedProps = FilteredProps & LifecycleHooks<FilteredProps>;

const hideOnPopperBlur: Plugin<ExtendedProps> = {
  name: 'hideOnPopperBlur',
  defaultValue: true,
  fn(instance) {
    return {
      onCreate() {
        instance.popper.addEventListener('focusout', (event) => {
          if (
            instance.props.hideOnPopperBlur &&
            event.relatedTarget &&
            !instance.popper.contains(event.relatedTarget as Node)
          ) {
            instance.hide();
          }
        });
      }
    };
  }
};

const hideOnEsc: Plugin<ExtendedProps> = {
  name: 'hideOnEsc',
  defaultValue: true,
  fn({ hide, props }) {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        hide();
      }
    }

    return {
      onShow() {
        if (props.hideOnEsc) {
          document.addEventListener('keydown', onKeyDown);
        }
      },
      onHide() {
        if (props.hideOnEsc) {
          document.removeEventListener('keydown', onKeyDown);
        }
      }
    };
  }
};

const hideOthersOnOpen: Plugin<ExtendedProps> = {
  name: 'hideOthersOnOpen',
  defaultValue: true,
  fn(instance) {
    return {
      onShow() {
        if (instance.props.hideOthersOnOpen) {
          hideAll({ exclude: instance as unknown as Instance<Props> });
        }
      }
    };
  }
};

export default function (node: HTMLElement, options?: Partial<Props>) {
  const plugins = [hideOnPopperBlur, hideOnEsc, hideOthersOnOpen];
  const _options = options ? { ...options, plugins } : { plugins };
  const instance = tippy(node, _options);
  return {
    update(newOptions: Partial<Props>) {
      const _newOptions = newOptions ? { ...newOptions, plugins } : { plugins };
      instance.setProps(_newOptions);
    },
    destroy() {
      instance.destroy();
    }
  };
}
