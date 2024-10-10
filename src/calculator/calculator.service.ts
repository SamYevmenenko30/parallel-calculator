import { Injectable } from '@nestjs/common';

@Injectable()
export class CalculatorService {
    private operators = ['+', '-', '*', '/'];
    private isOperator(c: string): boolean {
        return this.operators.includes(c);
    }

    private getOperatorPriority(op: string): number {
        if (op === '+' || op === '-') return 1;
        if (op === '*' || op === '/') return 2;
        return 0;
    }

    private applyOperation(a: number, b: number, operation: string): number {
        switch (operation) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return a / b;
            default: throw new Error('Invalid operator');
        }
    }

    evaluateExpression(expression: string): number {
        const values: number[] = [];
        const operators: string[] = [];
        let i = 0;
        //we can also remove the spaces, but in my opinion ot would lead to more processing power usage,
        // cause the replace method itself has O(n) complexity, we can just jump over the spaces, how done on line 36
        // expression = expression.replace(' ', '');

        while (i < expression.length) {
            if (expression[i] === ' ') {
                i++;
                continue;
            }

           if (expression[i] === '(') {
                operators.push(expression[i]);
            } else if (expression[i] === ')') {
                // check if we have operators, and operator before closing brace is not the opening brace, cause in this case, there is no operation to complete
                while (operators.length && operators[operators.length - 1] !== '(') {
                    const val2 = values.pop();
                    const val1 = values.pop();
                    const operator = operators.pop();

                    if (val1 !== undefined && val2 !== undefined && operator !== undefined) {
                        values.push(this.applyOperation(val1, val2, operator));
                    }
                }
                // remove opening brace
                operators.pop();
            } else if (!isNaN(parseInt(expression[i]))) {
               let val = 0;
               while (i < expression.length && !isNaN(parseInt(expression[i], 10))) {
                   val = (val * 10) + (parseInt(expression[i], 10));
                   i++;
               }
               values.push(val);
               i--;
           }  else if (this.isOperator(expression[i])) {
                // if current char is an operator, and previous operator has more priority than current one, we need to calculate numbers with the previous operator
                while (operators.length && this.getOperatorPriority(operators[operators.length - 1]) >= this.getOperatorPriority(expression[i])) {
                    const val2 = values.pop();
                    const val1 = values.pop();
                    const operator = operators.pop();
                    if (val1 !== undefined && val2 !== undefined  && operator !== undefined) {
                        values.push(this.applyOperation(val1, val2, operator));
                    }
                }
                operators.push(expression[i]);
            }
            i++;
        }

        while (operators.length) {
            const val2 = values.pop();
            const val1 = values.pop();
            const op = operators.pop();
            if (val1 !== undefined && val2 !== undefined && op !== undefined) {
                values.push(this.applyOperation(val1, val2, op));
            }
        }
        // the last value is always the result.
        const value = values[values.length - 1];

        if (value === undefined) {
            throw new Error('Expression has wrong format')
        }

        return value;
    }
}
