import React, { Component, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class RouterErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Unhandled error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
          <div className="text-center max-w-lg mx-auto">
            <h1 className="text-4xl font-bold text-red-600 dark:text-red-500 mb-4">
              Bir Hata Oluştu
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin.
            </p>
            {this.state.error && (
              <pre className="bg-gray-200 dark:bg-gray-800 p-4 rounded-md text-left text-sm overflow-x-auto text-red-700 dark:text-red-300 mb-6">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex justify-center gap-4">
              <button
                onClick={this.handleReload}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              >
                Sayfayı Yenile
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
