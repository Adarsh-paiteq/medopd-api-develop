export enum VideoCallsEvent {
  VIDEO_CALL_STARTED = '[VIDEO_CALLS] VIDEO_CALL_STARTED',
}

export class VideoCallStartedEvent {
  constructor(
    public roomId: string,
    public clinicId: string,
    public doctorId: string,
  ) {}
}
