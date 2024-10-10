import { Controller, Post, Body } from '@nestjs/common';
import { CalculatorService } from './calculator.service';

@Controller('evaluate')
export class CalculatorController {
    constructor(private readonly calculatorService: CalculatorService) {}

    @Post()
    evaluate(@Body('expression') expression: string) {
        try {
            const result = this.calculatorService.evaluateExpression(expression);
            return { result };
        } catch (error) {
            return { error: error.message };
        }
    }
}
