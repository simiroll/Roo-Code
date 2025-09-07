import { render, screen } from "@/utils/test-utils"

import { CloudView } from "../CloudView"

// Mock the translation context
vi.mock("@src/i18n/TranslationContext", () => ({
	useAppTranslation: () => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				"cloud:title": "Cloud",
				"settings:common.done": "Done",
				"cloud:signIn": "Connect to Roo Code Cloud",
				"cloud:cloudBenefitsTitle": "Connect to Roo Code Cloud",
				"cloud:cloudBenefitSharing": "Share tasks with others",
				"cloud:cloudBenefitHistory": "Access your task history",
				"cloud:cloudBenefitMetrics": "Get a holistic view of your token consumption",
				"cloud:logOut": "Log out",
				"cloud:connect": "Connect Now",
				"cloud:visitCloudWebsite": "Visit Roo Code Cloud",
				"cloud:remoteControl": "Roomote Control",
				"cloud:remoteControlDescription":
					"Enable following and interacting with tasks in this workspace with Roo Code Cloud",
				"cloud:profilePicture": "Profile picture",
				"cloud:cloudUrlPillLabel": "Roo Code Cloud URL: ",
			}
			return translations[key] || key
		},
	}),
}))

// Mock vscode utilities
vi.mock("@src/utils/vscode", () => ({
	vscode: {
		postMessage: vi.fn(),
	},
}))

// Mock telemetry client
vi.mock("@src/utils/TelemetryClient", () => ({
	telemetryClient: {
		capture: vi.fn(),
	},
}))

// Mock the extension state context
vi.mock("@src/context/ExtensionStateContext", () => ({
	useExtensionState: () => ({
		remoteControlEnabled: false,
		setRemoteControlEnabled: vi.fn(),
	}),
}))

// Mock window global for images
Object.defineProperty(window, "IMAGES_BASE_URI", {
	value: "/images",
	writable: true,
})

describe("CloudView", () => {
	it("should display benefits when user is not authenticated", () => {
		render(
			<CloudView
				userInfo={null}
				isAuthenticated={false}
				cloudApiUrl="https://app.roocode.com"
				onDone={() => {}}
			/>,
		)

		// Check that the benefits section is displayed
		expect(screen.getByRole("heading", { name: "Connect to Roo Code Cloud" })).toBeInTheDocument()
		expect(screen.getByText("Share tasks with others")).toBeInTheDocument()
		expect(screen.getByText("Access your task history")).toBeInTheDocument()
		expect(screen.getByText("Get a holistic view of your token consumption")).toBeInTheDocument()

		// Check that the connect button is also present
		expect(screen.getByText("Connect Now")).toBeInTheDocument()
	})

	it("should not display benefits when user is authenticated", () => {
		const mockUserInfo = {
			name: "Test User",
			email: "test@example.com",
		}

		render(
			<CloudView
				userInfo={mockUserInfo}
				isAuthenticated={true}
				cloudApiUrl="https://app.roocode.com"
				onDone={() => {}}
			/>,
		)

		// Check that the benefits section is NOT displayed
		expect(
			screen.queryByText("Follow and control tasks from anywhere with Roomote Control"),
		).not.toBeInTheDocument()
		expect(screen.queryByText("Share tasks with others")).not.toBeInTheDocument()
		expect(screen.queryByText("Access your task history")).not.toBeInTheDocument()
		expect(screen.queryByText("Get a holistic view of your token consumption")).not.toBeInTheDocument()

		// Check that user info is displayed instead
		expect(screen.getByText("Test User")).toBeInTheDocument()
		expect(screen.getByText("test@example.com")).toBeInTheDocument()
	})

	it("should display remote control toggle when user has extension bridge enabled", () => {
		const mockUserInfo = {
			name: "Test User",
			email: "test@example.com",
			extensionBridgeEnabled: true,
		}

		render(
			<CloudView
				userInfo={mockUserInfo}
				isAuthenticated={true}
				cloudApiUrl="https://app.roocode.com"
				onDone={() => {}}
			/>,
		)

		// Check that the remote control toggle is displayed
		expect(screen.getByTestId("remote-control-toggle")).toBeInTheDocument()
		expect(screen.getByText("Roomote Control")).toBeInTheDocument()
		expect(
			screen.getByText("Enable following and interacting with tasks in this workspace with Roo Code Cloud"),
		).toBeInTheDocument()
	})

	it("should not display remote control toggle when user does not have extension bridge enabled", () => {
		const mockUserInfo = {
			name: "Test User",
			email: "test@example.com",
			extensionBridgeEnabled: false,
		}

		render(
			<CloudView
				userInfo={mockUserInfo}
				isAuthenticated={true}
				cloudApiUrl="https://app.roocode.com"
				onDone={() => {}}
			/>,
		)

		// Check that the remote control toggle is NOT displayed
		expect(screen.queryByTestId("remote-control-toggle")).not.toBeInTheDocument()
		expect(screen.queryByText("Roomote Control")).not.toBeInTheDocument()
	})

	it("should not display cloud URL pill when pointing to production", () => {
		const mockUserInfo = {
			name: "Test User",
			email: "test@example.com",
		}

		render(
			<CloudView
				userInfo={mockUserInfo}
				isAuthenticated={true}
				cloudApiUrl="https://app.roocode.com"
				onDone={() => {}}
			/>,
		)

		// Check that the cloud URL pill is NOT displayed for production URL
		expect(screen.queryByText(/Roo Code Cloud URL:/)).not.toBeInTheDocument()
	})

	it("should display cloud URL pill when pointing to non-production environment", () => {
		const mockUserInfo = {
			name: "Test User",
			email: "test@example.com",
		}

		render(
			<CloudView
				userInfo={mockUserInfo}
				isAuthenticated={true}
				cloudApiUrl="https://staging.roocode.com"
				onDone={() => {}}
			/>,
		)

		// Check that the cloud URL pill is displayed with the staging URL
		expect(screen.getByText(/Roo Code Cloud URL:/)).toBeInTheDocument()
		expect(screen.getByText("https://staging.roocode.com")).toBeInTheDocument()
	})

	it("should display cloud URL pill for non-authenticated users when not pointing to production", () => {
		render(
			<CloudView
				userInfo={null}
				isAuthenticated={false}
				cloudApiUrl="https://dev.roocode.com"
				onDone={() => {}}
			/>,
		)

		// Check that the cloud URL pill is displayed even when not authenticated
		expect(screen.getByText(/Roo Code Cloud URL:/)).toBeInTheDocument()
		expect(screen.getByText("https://dev.roocode.com")).toBeInTheDocument()
	})

	it("should not display cloud URL pill when cloudApiUrl is undefined", () => {
		const mockUserInfo = {
			name: "Test User",
			email: "test@example.com",
		}

		render(<CloudView userInfo={mockUserInfo} isAuthenticated={true} onDone={() => {}} />)

		// Check that the cloud URL pill is NOT displayed when cloudApiUrl is undefined
		expect(screen.queryByText(/Roo Code Cloud URL:/)).not.toBeInTheDocument()
	})
})
