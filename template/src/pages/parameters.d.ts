// parameters.d.ts

// Define a type for the base structure of a parameter
interface BaseParameter {
    name: string;
    caption: string;
}

// Extend the base parameter for specific types
interface CheckboxParameter extends BaseParameter {
    type: 'checkbox';
    checked: boolean;
    initial?: number;
}

interface ColorParameter extends BaseParameter {
    type: 'color';
    initial: string;
}

interface DateParameter extends BaseParameter {
    type: 'date';
    initial?: string | Date;
}

interface EmailParameter extends BaseParameter {
    type: 'email';
    initial?: string;
}

interface FloatParameter extends BaseParameter {
    type: 'float';
    initial: number;
    step?: number;
}

interface IntParameter extends BaseParameter {
    type: 'int';
    initial: number;
    step?: number;
}

interface NumberParameter extends BaseParameter {
    type: 'number';
    initial: number;
    step?: number;
}

interface PasswordParameter extends BaseParameter {
    type: 'password';
    initial?: string;
}

interface SliderParameter extends BaseParameter {
    type: 'slider';
    min: number;
    max: number;
    step?: number;
    initial?: number;
}

interface TextParameter extends BaseParameter {
    type: 'text';
    initial?: string;
}

interface UrlParameter extends BaseParameter {
    type: 'url';
    initial?: string;
}

interface GroupParameter extends BaseParameter {
    type: 'group';
}


// Union type for all parameter types that can have a value
type ValueParameter = CheckboxParameter | ColorParameter | DateParameter | EmailParameter | FloatParameter | IntParameter | NumberParameter | PasswordParameter | SliderParameter | TextParameter | UrlParameter;

// Union type for all parameter types
type Parameter = ValueParameter | GroupParameter;

// Export the types
export { Parameter, ValueParameter, CheckboxParameter, ColorParameter, DateParameter, EmailParameter, FloatParameter, IntParameter, NumberParameter, PasswordParameter, SliderParameter, TextParameter, UrlParameter, GroupParameter };
