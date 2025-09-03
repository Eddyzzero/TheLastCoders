export interface Question {
    id: string;
    question: string;
    options: {
        value: string;
        label: string;
    }[];
}
