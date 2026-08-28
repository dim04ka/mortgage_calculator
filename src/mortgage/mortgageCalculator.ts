export type BelarusbankAnnuityRow = {
  month: number;
  rate: number;
  startDebt: number;
  mainDebtPayment: number;
  overpayment: number;
  interestPayment: number;
  totalPayment: number;
  endDebt: number;
};

export type OverpaymentEntry = {
  month: number;
  amount: number;
};

export type OverpaymentPeriod = {
  id: string;
  fromMonth: number;
  toMonth: number;
  amount: number;
};

export function expandOverpaymentPeriods(
  periods: OverpaymentPeriod[],
): OverpaymentEntry[] {
  const byMonth = new Map<number, number>();

  for (const period of periods) {
    const start = Math.min(period.fromMonth, period.toMonth);
    const end = Math.max(period.fromMonth, period.toMonth);

    for (let month = start; month <= end; month++) {
      byMonth.set(month, period.amount);
    }
  }

  return [...byMonth.entries()].map(([month, amount]) => ({ month, amount }));
}

export type PaymentType = 'annuity' | 'differentiated';

export type MortgageInput = {
  principal: number;
  totalMonths: number;
  graceMonths: number;
  rateFirstYear: number;
  rateAfterward: number;
  overpayments: OverpaymentEntry[];
  paymentType: PaymentType;
};

export type ScheduleSummary = {
  monthsPaid: number;
  totalPaid: number;
  totalInterest: number;
  totalOverpaid: number;
  requiredAnnuity: number;
  interestSaved: number;
  monthsSaved: number;
};

function calculateAnnuityPayment(
  currentPrincipal: number,
  monthsLeft: number,
  rateAfterward: number,
): number {
  if (monthsLeft <= 0 || currentPrincipal <= 0) return 0;

  const monthlyRate = rateAfterward / 100 / 12;

  return Number(
    (
      (currentPrincipal *
        (monthlyRate * Math.pow(1 + monthlyRate, monthsLeft))) /
      (Math.pow(1 + monthlyRate, monthsLeft) - 1)
    ).toFixed(2),
  );
}

function calculateDifferentiatedPrincipal(
  currentPrincipal: number,
  monthsLeft: number,
): number {
  if (monthsLeft <= 0 || currentPrincipal <= 0) return 0;

  return Number((currentPrincipal / monthsLeft).toFixed(2));
}

function getActiveMonthsRemaining(
  totalMonths: number,
  graceMonths: number,
  month: number,
): number {
  return Math.max(1, totalMonths - Math.max(graceMonths, month));
}

function toOverpaymentMap(entries: OverpaymentEntry[]): Map<number, number> {
  return new Map(entries.map((entry) => [entry.month, entry.amount]));
}

export function generateSchedule(input: MortgageInput): BelarusbankAnnuityRow[] {
  const {
    principal,
    totalMonths,
    graceMonths,
    rateFirstYear,
    rateAfterward,
    overpayments,
    paymentType,
  } = input;

  const overpaymentMap = toOverpaymentMap(overpayments);
  const schedule: BelarusbankAnnuityRow[] = [];
  const activeMonths = totalMonths - graceMonths;
  let remainingDebt = principal;
  let currentRequiredAnnuity = calculateAnnuityPayment(
    principal,
    activeMonths,
    rateAfterward,
  );
  let currentPrincipalPortion = calculateDifferentiatedPrincipal(
    principal,
    activeMonths,
  );

  for (let month = 1; month <= totalMonths; month++) {
    if (remainingDebt <= 0) break;

    const isGrace = month <= graceMonths;
    const currentRate = isGrace ? rateFirstYear : rateAfterward;
    const startDebt = remainingDebt;
    const interestPayment = Number(
      ((startDebt * (currentRate / 100)) / 12).toFixed(2),
    );

    let plannedTotal: number;
    let plannedMainDebt: number;

    if (isGrace) {
      plannedTotal = interestPayment;
      plannedMainDebt = 0;
    } else if (paymentType === 'annuity') {
      if (
        month === totalMonths ||
        startDebt <= currentRequiredAnnuity - interestPayment
      ) {
        plannedMainDebt = startDebt;
        plannedTotal = Number((plannedMainDebt + interestPayment).toFixed(2));
      } else {
        plannedTotal = currentRequiredAnnuity;
        plannedMainDebt = Number((plannedTotal - interestPayment).toFixed(2));
      }
    } else if (
      month === totalMonths ||
      startDebt <= currentPrincipalPortion
    ) {
      plannedMainDebt = startDebt;
      plannedTotal = Number((plannedMainDebt + interestPayment).toFixed(2));
    } else {
      plannedMainDebt = currentPrincipalPortion;
      plannedTotal = Number((plannedMainDebt + interestPayment).toFixed(2));
    }

    const extraPayment = overpaymentMap.get(month) || 0;
    const actualExtraPayment = Math.min(
      extraPayment,
      Math.max(0, Number((startDebt - plannedMainDebt).toFixed(2))),
    );

    const totalMainDebtPaid = Number(
      (plannedMainDebt + actualExtraPayment).toFixed(2),
    );
    const totalMonthPayment = Number(
      (plannedTotal + actualExtraPayment).toFixed(2),
    );
    remainingDebt = Number((startDebt - totalMainDebtPaid).toFixed(2));

    schedule.push({
      month,
      rate: currentRate,
      startDebt,
      mainDebtPayment: plannedMainDebt,
      overpayment: actualExtraPayment,
      interestPayment,
      totalPayment: totalMonthPayment,
      endDebt: Math.max(0, remainingDebt),
    });

    if (actualExtraPayment > 0 && month < totalMonths) {
      const activeMonthsRemaining = getActiveMonthsRemaining(
        totalMonths,
        graceMonths,
        month,
      );

      if (paymentType === 'annuity') {
        currentRequiredAnnuity = calculateAnnuityPayment(
          remainingDebt,
          activeMonthsRemaining,
          rateAfterward,
        );
      } else {
        currentPrincipalPortion = calculateDifferentiatedPrincipal(
          remainingDebt,
          activeMonthsRemaining,
        );
      }
    }
  }

  return schedule;
}

function sumBy(
  schedule: BelarusbankAnnuityRow[],
  key: keyof Pick<
    BelarusbankAnnuityRow,
    'totalPayment' | 'interestPayment' | 'overpayment'
  >,
): number {
  return Number(
    schedule.reduce((sum, row) => sum + row[key], 0).toFixed(2),
  );
}

export function summarizeSchedule(
  schedule: BelarusbankAnnuityRow[],
  totalMonths: number,
  graceMonths: number,
  baselineInterest: number,
): ScheduleSummary {
  const firstActiveRow = schedule.find((row) => row.month > graceMonths);

  return {
    monthsPaid: schedule.length,
    totalPaid: sumBy(schedule, 'totalPayment'),
    totalInterest: sumBy(schedule, 'interestPayment'),
    totalOverpaid: sumBy(schedule, 'overpayment'),
    requiredAnnuity: firstActiveRow
      ? Number(
          (firstActiveRow.totalPayment - firstActiveRow.overpayment).toFixed(2),
        )
      : 0,
    interestSaved: Number(
      Math.max(0, baselineInterest - sumBy(schedule, 'interestPayment')).toFixed(
        2,
      ),
    ),
    monthsSaved: Math.max(0, totalMonths - schedule.length),
  };
}
