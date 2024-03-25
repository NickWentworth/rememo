import { Close } from '@/components/icons';
import Button from '@/components/Button';
import { FormController } from '@/lib/hooks/useFormController';
import styles from './structure.module.css';

type FormProps<T> = {
    /** Returned from useFormController hook */
    controller: FormController<T>;

    /** What to do after the form's submit button is clicked */
    onSubmit: () => void;

    /** String displayed after state of form (Create, Modify, ...) */
    title: string;

    /** <hr /> separated sections of the form */
    sections: React.ReactNode[];
};

export function Form<T>(props: FormProps<T>) {
    let title;
    switch (props.controller.state.mode) {
        case 'closed':
            return;

        case 'create':
            title = `Add ${props.title}`;
            break;

        case 'update':
            title = `Modify ${props.title}`;
            break;
    }

    return (
        <div className={styles.fill}>
            <form className={styles.form} onSubmit={props.onSubmit}>
                <div className={styles.header}>
                    <h1>{title}</h1>

                    <Button
                        type='transparent'
                        onClick={props.controller.close}
                        icon={<Close color='white' size={30} />}
                    />
                </div>

                <hr />

                <div className={styles.body}>
                    {props.sections.flatMap((section, idx) => [
                        // should be safe to use idx as key, sections should be left constant
                        <div key={idx}>{section}</div>,
                        <hr
                            key={`${idx}hr`}
                            hidden={idx === props.sections.length - 1}
                        />,
                    ])}
                </div>

                <hr />

                <div className={styles.footer}>
                    <Button type='solid' submit>
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
}
