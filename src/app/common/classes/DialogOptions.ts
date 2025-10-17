export abstract class DialogOptionsBase {
  abstract dialogEnableNext?: boolean;
  abstract get dialogTitle(): string;
  abstract get dialogStyle(): string | undefined;
}
