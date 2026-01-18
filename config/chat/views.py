from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ChatHistory
from .serializers import ChatHistorySerializer
from .gemini import get_ai_response
from django.shortcuts import render

@api_view(['POST'])
def chat_with_ai(request):
    user_message = request.data.get("message")

    if not user_message:
        return Response({"error": "Message is required"}, status=400)

    ai_reply = get_ai_response(user_message)

    chat = ChatHistory.objects.create(
        user_message=user_message,
        ai_response=ai_reply
    )

    serializer = ChatHistorySerializer(chat)
    return Response(serializer.data, status=201)

@api_view(['GET'])
def get_chat_history(request):
    chats = ChatHistory.objects.all().order_by('-created_at')
    serializer = ChatHistorySerializer(chats, many=True)
    return Response(serializer.data)

def chat_ui(request):
    return render(request, "chat.html")
