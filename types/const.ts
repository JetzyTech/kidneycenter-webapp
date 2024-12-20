export enum Pages {
	Dasshboard = "Dashboard",
	Events = "Events",
}

export enum Roles {
	USER = "user",
	ADMIN = "admin",
}

export enum EventPrivacy {
	PUBLIC = "public",
	PRIVATE = "private",
	GROUP = "group",
}

export enum TransactionStatus {
	PENDING = "pending",
	SUCCESS = "success",
	FAILED = "failed",
	RESERVED = "reserved",
}

export enum SocketEvents {
	CLOSE = "close",
	CONNECT = "connect",
	CONNECT_ERROR = "connect_error",
	JOIN = "join_room",
	SEND_MESSAGE = "send_message",
	MESSAGES = "chat_messages",
	TYPING = "typing",
	IS_TYPING = "is_typing",
	NEW_MESSAGE = "new_message",
	CONVERSATIONS = "conversations",
}
