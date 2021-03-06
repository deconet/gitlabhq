# Use for authentication only, in particular for Rack::Attack.
# Does not perform authorization of scopes, etc.
module Gitlab
  module Auth
    class RequestAuthenticator
      include UserAuthFinders

      attr_reader :request

      def initialize(request)
        @request = request
      end

      def user
        find_sessionless_user || find_user_from_warden
      end

      def find_sessionless_user
        find_user_from_access_token || find_user_from_rss_token || find_user_from_deconet_token
      rescue Gitlab::Auth::AuthenticationError
        nil
      end
    end
  end
end
